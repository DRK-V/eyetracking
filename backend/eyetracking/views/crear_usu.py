import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection

@csrf_exempt
def crear_usuario(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)

            # Extraer los datos del usuario
            nombre = data.get('nombre', '')
            apellido = data.get('apellido', '')
            correo = data.get('correo', '')
            contrasena = data.get('contrasena', '')
            rol = data.get('rol', '')

            # Primero, verificar si el correo ya existe
            with connection.cursor() as cursor:
                cursor.execute("SELECT correo FROM cliente WHERE correo = %s", [correo])
                correo_existente = cursor.fetchone()
            
            if correo_existente:
                # Si el correo ya existe, retornar un mensaje de error
                status=400
                return JsonResponse({'mensaje': 'El correo ya está registrado', 'status':status},)

            # Si el correo no existe, proceder a insertar el nuevo usuario
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO cliente (nombre, apellido, correo, contrasena, rol) VALUES (%s, %s, %s, %s, %s)",
                    (nombre, apellido, correo, contrasena, rol)
                )
                filas_afectadas = cursor.rowcount

            if filas_afectadas > 0:
                # Si se creó el usuario, obtener y retornar la información del nuevo usuario
                with connection.cursor() as cursor:
                    cursor.execute(
                        "SELECT id_cliente, nombre, apellido, edad, correo, rol FROM cliente WHERE correo = %s",
                        [correo]
                    )
                    cliente_info = cursor.fetchone()

                respuesta = {'mensaje': 'Usuario creado exitosamente', 'cliente_info': cliente_info}
            else:
                respuesta = {'mensaje': 'No se pudo crear el usuario'}

            return JsonResponse(respuesta)

        else:
            return JsonResponse({'mensaje': 'Método no permitido'}, status=405)

    except Exception as e:
        return JsonResponse({'mensaje': f'Ocurrió una excepción: {str(e)}'}, status=500)
