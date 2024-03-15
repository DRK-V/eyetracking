from django.db import connection
from django.conf import settings
import os
from .videos import obtener_info_proyecto

def generar_rutas_imagenes(request):
    proyecto_id = request.session.get('proyecto_id', None)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT fecha_creacion FROM proyecto WHERE id_proyecto = (%s)",
                [proyecto_id]
            )
            fecha_proyecto_str = cursor.fetchone()[0]
    except Exception as e:
        print(f"Error al obtener la fecha del proyecto: {e}")
        return {'rutas_imagenes': [], 'proyecto_info': None}

    proyecto_info = obtener_info_proyecto(proyecto_id)  # Agrega esta línea

    if fecha_proyecto_str:
        fecha_proyecto_formateada = fecha_proyecto_str.strftime('%Y%m%d')

        carpeta_proyecto = os.path.join(settings.MEDIA_ROOT, f'proyecto{proyecto_id}_{fecha_proyecto_formateada}')
        carpeta_imagenes = os.path.join(carpeta_proyecto, 'imagenes')

        print(f'RUTA CARPETA PROYECTO: {carpeta_proyecto}')
        print(f'RUTA CARPETA IMAGENES: {carpeta_imagenes}')


        rutas_imagenes = obtener_rutas_imagenes(carpeta_imagenes, carpeta_proyecto)

        print(f'RUTAS DE IMAGENES ENCONTRADAS: {rutas_imagenes}')
        return {'rutas_imagenes': rutas_imagenes, 'proyecto_info': proyecto_info}
    else:
        print("No se encontró la fecha del proyecto.")
        return {'rutas_imagenes': [], 'proyecto_info': None}


def obtener_lista_imagenes(carpeta_imagenes):
    try:
        if not os.access(carpeta_imagenes, os.R_OK):
            print(f"No tienes permisos de lectura en {carpeta_imagenes}")
            return []
        imagenes = [imagen for imagen in os.listdir(carpeta_imagenes) if imagen.endswith(('.jpg', '.jpeg', '.png'))]
        print(f'IMAGENES = {imagenes}')
        return imagenes
    except Exception as e:
        print(f"Error al listar archivos en la carpeta de imagenes: {e}")
        return []

def obtener_rutas_imagenes(carpeta_imagenes, carpeta_proyecto):
    rutas_imagenes = []
    imagenes = obtener_lista_imagenes(carpeta_imagenes)

    for imagen in imagenes:
        try:
            # Limpiar el nombre de la imagen reemplazando espacios con _
            nombre_imagen, _ = os.path.splitext(imagen)
            # nombre_imagen = nombre_imagen.replace(' ', '_')

            # Utiliza os.path.join para obtener la ruta completa
            ruta_imagen_completa = os.path.join(carpeta_proyecto, 'imagenes', imagen)
            
            # Utiliza os.path.relpath para obtener la ruta relativa
            ruta_imagen_relativa = os.path.relpath(ruta_imagen_completa, settings.MEDIA_ROOT)

            # Combina la ruta relativa con MEDIA_URL
            ruta_imagen_final = os.path.join(settings.MEDIA_URL, ruta_imagen_relativa).replace("\\", "/")

            rutas_imagenes.append({'nombre': nombre_imagen, 'ruta': f'{ruta_imagen_final}', 'nombre_imagen': nombre_imagen})
        except Exception as e:
            print(f"Error al procesar la ruta de la imagen {imagen}: {e}")
            rutas_imagenes.append({'nombre': nombre_imagen, 'ruta': None, 'error': f"Error al procesar la ruta de la imagen {imagen}: {e}"})
            print(f"""CAUSANTE DE ERROR:
                    nombre: {nombre_imagen}, 'ruta': '{ruta_imagen_final}'
                  """)

    return rutas_imagenes
