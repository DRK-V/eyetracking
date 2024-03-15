#linea_graphh
from django.db import connection
from django.http import JsonResponse

def obtener_informacion_metricas(codigo_proyecto, recording_name):
    query = """
        SELECT 
            m.id_metricas,
            m.codigo_proyecto,
            m.pupil_diameter_left,
            m.pupil_diameter_right,
            m.recording_timestamp,
            m.genero,
            m.edad
        FROM metricas m
        WHERE m.codigo_proyecto = %s AND m.recording_name = %s;
    """
    if not recording_name:
        recording_name = obtener_primer_participante(codigo_proyecto)
    with connection.cursor() as cursor:
        cursor.execute(query, [codigo_proyecto, recording_name])
        informacion_metricas = cursor.fetchall()

    return informacion_metricas

def obtener_primer_participante(codigo_proyecto):
    query = """
        SELECT MIN(m.recording_name) as primer_participante
        FROM metricas m
        WHERE m.codigo_proyecto = %s;
    """
    with connection.cursor() as cursor:
        cursor.execute(query, [codigo_proyecto])
        primer_participante = cursor.fetchone()[0]
    return primer_participante

def obtener_participantes(codigo_proyecto):
    query = """
        SELECT DISTINCT m.recording_name
        FROM metricas m
        WHERE m.codigo_proyecto = %s;
    """
    with connection.cursor() as cursor:
        cursor.execute(query, [codigo_proyecto])
        participantes = [row[0] for row in cursor.fetchall()]
        print(f'Participantes obtenidos: {participantes}')
    return participantes

def create_response(metricas, recording_name, participantes):
    return {
        'metricas': metricas,
        'numero_participante': {
            'recording_name': recording_name,
            'id_campo_recording_name': None
        },
        'participantes': participantes
    }

def graph_data(request):
    codigo_proyecto = request.session.get('proyecto_id', None)
    recording_name = request.GET.get('recording_name')
    print(f'RECORDING NAME EN GRAPH_DATA {recording_name}')
    
    if codigo_proyecto:
        participantes = obtener_participantes(codigo_proyecto)
        metricas = obtener_informacion_metricas(codigo_proyecto, recording_name)
        return JsonResponse(create_response(metricas, recording_name, participantes), safe=False)
    else:
        return JsonResponse({'error': 'Proyecto no proporcionado'})

