import json
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.db import connection

@csrf_exempt
def validar_usuario(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            correo = data.get('correo', '')
            contrasena = data.get('contrasena', '')

            # Consulta SQL cruda para verificar el usuario y la contraseña
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM cliente WHERE correo = %s AND contrasena = %s", [correo, contrasena])
                cliente = cursor.fetchone()

            if cliente:
                # Consulta adicional para obtener todos los datos del cliente (excepto la contraseña)
                with connection.cursor() as cursor:
                    cursor.execute("SELECT id_cliente, nombre,apellido,edad,correo,contrasena,rol FROM cliente WHERE correo = %s", [correo])
                    cliente_info = cursor.fetchone()

                respuesta = {'autenticado': True, 'mensaje': 'Usuario y contraseña válidos', 'cliente_info': cliente_info}
            else:
                respuesta = {'autenticado': False, 'mensaje': 'Usuario o contraseña incorrectos'}

            return JsonResponse(respuesta)

        except Exception as e:
            return JsonResponse({'autenticado': False, 'error': str(e)})

    return JsonResponse({'autenticado': False, 'mensaje': 'Método no permitido'}, status=405)


def login(request):
    # Verifica si el usuario ya está autenticado
    if request.user.is_authenticated:
        # Si ya está autenticado, redirige a la página de inicio
        return redirect('pages/home.html')

    if request.method == 'POST':
        correo = request.POST['correo']
        contrasena = request.POST['contrasena']

        # Realiza la autenticación
        user = authenticate(request, correo=correo, password=contrasena)

        if user is not None:
            # Si el usuario es válido, inicia sesión manualmente
            login(request, user)

            # Verifica si la cookie user_eyetracking está presente
            if 'user_eyetracking' in request.COOKIES:
                # Obtiene los datos del usuario desde la cookie
                user_info = json.loads(request.COOKIES['user_eyetracking'])
                # Puedes hacer algo con user_info según tus necesidades
                # print('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
                return redirect('pages/home.html')        
            else:
                # Si la cookie no está presente, redirige a la página de inicio
                return redirect('pages/home.html')  # Reemplaza 'tu_ruta:tu_vista' con la ruta correcta
        else:
            # Si la autenticación falla, puedes manejarlo según tus necesidades
            return render(request, 'pages/login.html', {'error': 'Usuario o contraseña incorrectos'})

    return render(request, 'pages/login.html')