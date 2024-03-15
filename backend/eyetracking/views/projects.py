import os
from datetime import datetime
import json
from django.conf import settings
from django.http import HttpResponseServerError
from django.shortcuts import render , redirect
from django.db import connection
from django.http import JsonResponse

def crear_proyecto(request):
    temporal_id_proyecto = 0
    if request.method == 'POST':
        print(request.POST)  

        nombre_proyecto = request.POST.get('nombre_proyecto')
        descripcion_proyecto = request.POST.get('descripcion_proyecto')

        user_info = json.loads(request.COOKIES['user_eyetracking'])
        id_cliente = user_info[0]

        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO proyecto (nombre_proyecto, descripcion_proyecto) VALUES (%s, %s) RETURNING id_proyecto",
                [nombre_proyecto, descripcion_proyecto]
            )
            id_proyecto = cursor.fetchone()[0]
            temporal_id_proyecto = id_proyecto
            print(f"Inserción en la tabla 'proyecto': id_proyecto={id_proyecto}, nombre_proyecto={nombre_proyecto}, descripcion_proyecto={descripcion_proyecto}")

            # Insertar en la tabla 'info_proyecto'
            cursor.execute(
                "INSERT INTO info_proyecto (codigo_cliente, codigo_proyecto) VALUES (%s, %s)",
                [id_cliente, id_proyecto]
            )
          
            print(f"Inserción en la tabla 'info_proyecto': codigo_cliente={id_cliente}, codigo_proyecto={id_proyecto}")

            # Crear la estructura de carpetas
            try:
                fecha_creacion = datetime.now().strftime("%Y%m%d")
                proyecto_folder_name = f"proyecto{id_proyecto}_{fecha_creacion}"
                proyecto_path = os.path.join(settings.MEDIA_ROOT, proyecto_folder_name)

                # Crear carpeta del proyecto
                os.makedirs(proyecto_path)

                # Crear subcarpetas
                subcarpetas = ['archivos_subidos', 'videos', 'imagenes']
                for subcarpeta in subcarpetas:
                    subcarpeta_path = os.path.join(proyecto_path, subcarpeta)
                    os.makedirs(subcarpeta_path)
                print(f' ID TEMPORAL DEL PROYECTO: {temporal_id_proyecto}')
                request.session['proyecto_id'] = temporal_id_proyecto

            except Exception as e:
                print(f"Error al crear las carpetas: {e}")
                return HttpResponseServerError("Error interno del servidor")

        return redirect('homepage')

    return render(request, 'componentes/home/create_project.html')

def abrir_proyecto(request, proyecto_id):
    try:
        # Verificar si ya existe una variable de sesión para el ID del proyecto
        if 'proyecto_id' in request.session:
            # Si existe, elimínala antes de establecer la nueva
            del request.session['proyecto_id']

        # Establecer el nuevo ID del proyecto en la sesión
        request.session['proyecto_id'] = proyecto_id
        mensaje = "Proyecto inicializado"
    except Exception as e:
        # Manejar la excepción y devolver un mensaje de error
        mensaje = f"Error al establecer la sesión: {e}"

    # Puedes redirigir a la lista de proyectos o a donde desees
    # En este caso, redirigimos a la página de inicio (homepage)
    response_data = {'mensaje': mensaje}
    return JsonResponse(response_data)
  

def list_projects(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id_proyecto,nombre_proyecto,descripcion_proyecto,fecha_creacion FROM proyecto")
            column_names = [desc[0] for desc in cursor.description]
            proyectos = [dict(zip(column_names, row)) for row in cursor.fetchall()]
            # print('proyectos ######################', proyectos)
    except Exception as e:
        print(f"Error al ejecutar la consulta: {e}")
        proyectos = []

    return proyectos
