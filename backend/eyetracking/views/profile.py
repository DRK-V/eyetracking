import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection

@csrf_exempt
def actualizar_usuario(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)

            # Extraer los datos del usuario
            id = data.get('id', '')
            nombre = data.get('nombre', '')
            apellido = data.get('apellido', '')
            correo = data.get('correo', '')
            contrasena = data.get('contrasena', '')
            rol =data.get('rol', '')

            # Consulta SQL para actualizar el usuario
            with connection.cursor() as cursor:
                cursor.execute(
                    "UPDATE cliente SET nombre = %s, apellido = %s, correo = %s, contrasena = %s, rol = %s WHERE id_cliente = %s ",
                    [nombre, apellido, correo, contrasena, rol, id]
                )
                # Obtener el número de filas afectadas
                filas_afectadas = cursor.rowcount

            if filas_afectadas > 0:
                # Consulta para obtener los datos actualizados del cliente
                with connection.cursor() as cursor:
                    cursor.execute(
                        "SELECT id_cliente, nombre, apellido, edad, rol, correo FROM cliente WHERE id_cliente = %s",
                        [id]
                    )
                    cliente_info = cursor.fetchone()

                respuesta = {'mensaje': 'Datos actualizados exitosamente', 'cliente_info': cliente_info}
            else:
                respuesta = {'mensaje': 'Usuario o contraseña incorrectos'}

            return JsonResponse(respuesta)

        else:
            return JsonResponse({'mensaje': 'Método no permitido'}, status=405)

    except Exception as e:
        return JsonResponse({'mensaje': f'Ocurrió una excepción: {str(e)}'}, status=500)
