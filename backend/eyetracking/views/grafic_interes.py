from django.db import connection
from django.http import JsonResponse


def obtener_datos_interes(codigo_proyecto):
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
            Sum
        FROM interes
        WHERE codigo_proyecto = %s;
    """
    with connection.cursor() as cursor:
        cursor.execute(query, [codigo_proyecto])
        datos_interes = cursor.fetchall()

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
        "Sum"
    ]

    datos_organizados = [{columna: valor for columna, valor in zip(columnas, fila)} for fila in datos_interes]

    return datos_organizados


def graph_interes_data(request):
    codigo_proyecto = request.session.get('proyecto_id', None)
    
    if codigo_proyecto:
        datos_interes = obtener_datos_interes(codigo_proyecto)
        # Devolver los datos de interés organizados por columna en el JSON
        return JsonResponse({'datos_interes': datos_interes}, safe=False)
    else:
        return JsonResponse({'error': 'Proyecto no proporcionado'})
