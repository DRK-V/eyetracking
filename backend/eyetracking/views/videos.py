import os
# import imageio
from django.conf import settings
from django.db import connection

def obtener_lista_videos(carpeta_videos):
    try:
        if not os.access(carpeta_videos, os.R_OK):
            print(f"No tienes permisos de lectura en {carpeta_videos}")
            return []
        videos = [video for video in os.listdir(carpeta_videos) if video.endswith(('.mp4', '.avi', '.mkv'))]
        print(f'VIDEOS = {videos}')
        return videos
    except Exception as e:
        print(f"Error al listar archivos en la carpeta de videos: {e}")
        return []

def obtener_rutas_videos(carpeta_videos, carpeta_proyecto):
    rutas_videos = []
    videos = obtener_lista_videos(carpeta_videos)

    for video in videos:
        try:
            # Limpiar el nombre del video reemplazando espacios con _
            nombre_video, _ = os.path.splitext(video)
            # nombre_video = nombre_video.replace(' ', '_')

            # Utiliza os.path.join para obtener la ruta completa
            ruta_video_completa = os.path.join(carpeta_proyecto, 'videos', video)
            
            # Utiliza os.path.relpath para obtener la ruta relativa
            ruta_video_relativa = os.path.relpath(ruta_video_completa, settings.MEDIA_ROOT)

            # Combina la ruta relativa con MEDIA_URL
            ruta_video_final = os.path.join(settings.MEDIA_URL, ruta_video_relativa).replace("\\", "/")

            rutas_videos.append({'nombre': nombre_video, 'ruta': f'{ruta_video_final}', 'nombre_video': nombre_video})
        except Exception as e:
            print(f"Error al procesar la ruta del video {video}: {e}")
            rutas_videos.append({'nombre': nombre_video, 'ruta': None, 'error': f"Error al procesar la ruta del video {video}: {e}"})
            print(f"""CAUSANTE DE ERROR:
                    nombre: {nombre_video}, 'ruta': '{ruta_video_final}'
                  """)

    return rutas_videos


def obtener_info_proyecto(proyecto_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT nombre_proyecto, fecha_creacion FROM proyecto WHERE id_proyecto = (%s)",
                [proyecto_id]
            )
            proyecto_info = cursor.fetchone()
            return proyecto_info  # Devuelve una tupla (nombre_proyecto, fecha_creacion)
    except Exception as e:
        print(f"Error al obtener la información del proyecto: {e}")
        return None
    
def generar_rutas_videos(request):
    proyecto_id = request.session.get('proyecto_id', None)

    # Obtener información del proyecto
    proyecto_info = obtener_info_proyecto(proyecto_id)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT fecha_creacion FROM proyecto WHERE id_proyecto = (%s)",
                [proyecto_id]
            )
            fecha_proyecto_str = cursor.fetchone()[0]
    except Exception as e:
        print(f"Error al obtener la fecha del proyecto: {e}")
        return {'rutas_videos': [], 'proyecto_info': None}

    if fecha_proyecto_str:
        fecha_proyecto_formateada = fecha_proyecto_str.strftime('%Y%m%d')

        carpeta_proyecto = os.path.join(settings.MEDIA_ROOT, f'proyecto{proyecto_id}_{fecha_proyecto_formateada}')
        carpeta_videos = os.path.join(carpeta_proyecto, 'videos')

        request.session['ruta_videos'] = carpeta_proyecto
        print(f'RUTA CARPETA PROYECTO: {carpeta_proyecto}')
        # print(f'RUTA CARPETA VIDEOS: {carpeta_videos}')

        rutas_videos = obtener_rutas_videos(carpeta_videos, carpeta_proyecto)

        print(f'RUTAS DE VIDEOS ENCONTRADAS: {rutas_videos}')
        return {'rutas_videos': rutas_videos, 'proyecto_info': proyecto_info}
    else:
        print("No se encontró la fecha del proyecto.")
        return {'rutas_videos': [], 'proyecto_info': None}