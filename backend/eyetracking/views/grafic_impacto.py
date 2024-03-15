from django.db import connection
from django.http import JsonResponse


def obtener_datos_impacto(codigo_proyecto):
    query = """
        SELECT 
            Ref,
            codigo_proyecto,
            Participant,
            Edad,
            Genero,
            Marco,
            Patas,
            Puente,
            Average,
            Median,
            Count
        FROM impacto
        WHERE codigo_proyecto = %s;
    """
    with connection.cursor() as cursor:
        cursor.execute(query, [codigo_proyecto])
        datos_impacto = cursor.fetchall()

    # Organizar los datos por columna
    columnas = [
        "Ref",
        "codigo_proyecto",
        "Participant",
        "Edad",
        "Genero",
        "Marco",
        "Patas",
        "Puente",
        "Average",
        "Median",
        "Count"
    ]

    datos_organizados = [{columna: valor for columna, valor in zip(columnas, fila)} for fila in datos_impacto]

    return datos_organizados


def graph_impacto_data(request):
    codigo_proyecto = request.session.get('proyecto_id', None)
    
    if codigo_proyecto:
        datos_impacto = obtener_datos_impacto(codigo_proyecto)
        # Devolver los datos de impacto organizados por columna en el JSON
        return JsonResponse({'datos_impacto': datos_impacto}, safe=False)
    else:
        return JsonResponse({'error': 'Proyecto no proporcionado'})
