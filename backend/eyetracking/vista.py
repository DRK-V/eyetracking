import json
from django.db import connection
import pandas as pd
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
from django.views.static import serve
from django.http import Http404
from django.conf import settings
from .views.projects import list_projects  # importante la lógica de proyecto para poder mandar a la vista home la info de proyectos
from .views.videos import generar_rutas_videos
from .views.images import generar_rutas_imagenes

def serve_media(request, path):
    # Asegúrate de que estás sirviendo desde el directorio correcto
    try:
        response = serve(request, path, document_root=settings.MEDIA_ROOT)
    except Http404:
        # Personaliza la respuesta cuando no se encuentra el archivo
        response = HttpResponseNotFound('File not found')

    # Añadir encabezados necesarios, si es necesario
    response['Accept-Ranges'] = 'bytes'
    return response

def homepage(request):
    # Obtener el proyecto_id de la sesión
    proyecto_id = request.session.get('proyecto_id', None)
    print('AL EJECUTAR HOME - ID PROYECTO =================== >>>     ', proyecto_id)

    # Verificar si el proyecto existe en la base de datos
    with connection.cursor() as cursor:
        try:
            cursor.execute('SELECT id_proyecto FROM proyecto WHERE id_proyecto = %s', [proyecto_id])
            proyecto_existente = cursor.fetchone()

            if not proyecto_existente:
                print(f'No se encontró en la base de datos un id de proyecto {proyecto_id}')
                del request.session['proyecto_id']
        except Exception as e:
            print(f'Error al ejecutar la consulta a la base de datos: {e}')

    # Verificar si la cookie user_eyetracking está presente
    if 'user_eyetracking' in request.COOKIES:
        # Obtiene los datos del usuario desde la cookie
        user_info = json.loads(request.COOKIES['user_eyetracking'])
        print('Información del usuario:', user_info)
        
        # Obtener proyectos
        proyectos = list_projects(request)
        
        # Llamada a la función para obtener las rutas de videos y la información del proyecto
        resultado_generar_rutas = generar_rutas_videos(request)
        resultado_generar_rutas_imagenes = generar_rutas_imagenes(request)
        
        # Obtener rutas de imágenes y videos
        rutas_imagenes = resultado_generar_rutas_imagenes['rutas_imagenes']
        rutas_videos = resultado_generar_rutas['rutas_videos']
        proyecto_info = resultado_generar_rutas['proyecto_info']

        # Inicializar el objeto gestion
        gestion = {}

        # Verificar si hay registros en las tablas metricas, interes e impacto asociados al proyecto
        with connection.cursor() as cursor:
            cursor.execute('SELECT COUNT(*) FROM metricas WHERE codigo_proyecto = %s', [proyecto_id])
            metricas_existente = cursor.fetchone()[0] > 0

            cursor.execute('SELECT COUNT(*) FROM interes WHERE codigo_proyecto = %s', [proyecto_id])
            interes_existente = cursor.fetchone()[0] > 0

            cursor.execute('SELECT COUNT(*) FROM impacto WHERE codigo_proyecto = %s', [proyecto_id])
            impacto_existente = cursor.fetchone()[0] > 0

        # Construir el objeto gestion basado en la existencia de registros
        gestion['metricas'] = metricas_existente
        gestion['interes'] = interes_existente
        gestion['impacto'] = impacto_existente

        # Renderizar la plantilla con el contexto
        context = {'user_info': user_info, 'proyectos': proyectos, 'proyecto_id': proyecto_id,
                   'rutas_videos': rutas_videos, 'rutas_imagenes': rutas_imagenes, 'proyecto_info': proyecto_info,
                   'gestion': gestion}
        return render(request, 'pages/home.html', context)
    else:
        # La cookie no está presente, redirige a la página de inicio de sesión u otra página
        return redirect('login')

def index(request):
    return render(request, 'index.html')

def load_file(request):
    return render(request, 'pages/loadxlsx.html')


@csrf_exempt
def convert_to_csv(request):
    if request.method == 'POST' and request.FILES['excel_file']:
        excel_file = request.FILES['excel_file']

        try:
            chunks = pd.read_excel(excel_file, sheet_name=None)

            data_dict = {}

            for sheet_name, df in chunks.items():
                for _, row in df.iterrows():
                    participant_name = row['Participant name']

                    if participant_name not in data_dict:
                        data_dict[participant_name] = {
                            'Recording timestamp': [],
                            'Computer timestamp': [],
                            'Pupil diameter left': [],
                            'Pupil diameter right': [],
                            'Genero': row['Genero'],
                            'Edad': row['Edad'],
                            'Export date': row['Export date'],
                            'Sensor': row['Sensor'],
                            'Recording start time': row['Recording start time'],
                            'Recording start time UTC': row['Recording start time UTC'],
                            'Recording duration': row['Recording duration'],
                            'Recording Fixation filter name': row['Recording Fixation filter name'],
                        }

                    data_dict[participant_name]['Recording timestamp'].append(row['Recording timestamp'])
                    data_dict[participant_name]['Computer timestamp'].append(row['Computer timestamp'])
                    data_dict[participant_name]['Pupil diameter left'].append(row['Pupil diameter left'])
                    data_dict[participant_name]['Pupil diameter right'].append(row['Pupil diameter right'])

            result_dict = {
                'participants': data_dict,
            }

            # Convertir el diccionario a JSON
            json_data = json.dumps(result_dict, indent=4)

            # Configurar la respuesta HTTP para descargar el archivo JSON
            response = HttpResponse(json_data, content_type='application/json')
            response['Content-Disposition'] = 'attachment; filename="result.json"'

            return response
        except Exception as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Solicitud no válida'})

