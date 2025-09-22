// /*Código del registro:/Inicializar una variable que reciba datos del DOM*/
// const signupForm = document.querySelector('#signupForm')

// //Inicializaremos un evento para que nos envíe los datos con el botón
// signupForm.addEventListener('submit', (e) => {
//     e.preventDefault()

//     //Referenciar los datos
//     const name = document.querySelector('#name').value
//     const email = document.querySelector('#email').value
//     const password = document.querySelector('#password').value

//     //Trae los datos almacenados del arreglo que se nombra (users)
//     //Nos convierte los datos en JSON en el localstorage
//     const Users = JSON.parse(localStorage.getItem('users')) || []

//     //la función find() nos ayuda a buscar los datos almacenados
//     //Nos comprueba si el correo que se ingresa es igual al que esta guardado en el localstorage
//     const isUserRegistered = Users.find(user => user.email === email)

//     //Realizaremos una comprobación
//     if(isUserRegistered) {
//         return alert('El usuario ya esta registrado! , intentalo con otro')
//     }
//     //Agregaremos los datos al objeto
//     Users.push({name: name, email: email, password: password})
//     localStorage.setItem('users', JSON.stringify(Users))

//     alert('Registro Exitoso')
//     window.location.href = 'iniciosesionLS.html'
// })

// ==========================================
// APPLE-STYLE REGISTRATION FORM
// Validaciones elegantes y UX mejorada
// ==========================================

const signupForm = document.querySelector('#signupForm')
const formFields = {
    name: document.querySelector('#name'),
    number: document.querySelector('#number'),
    email: document.querySelector('#email'),
    password: document.querySelector('#password')
}

// Función para mostrar estados visuales y mensajes de error
function setFieldState(field, state, message = '') {
    field.classList.remove('error', 'success')
    if (state) {
        field.classList.add(state)
    }
    
    // Remover mensaje de error existente
    const existingError = field.parentNode.querySelector('.error-message')
    if (existingError) {
        existingError.remove()
    }
    
    // Agregar mensaje de error si existe
    if (state === 'error' && message) {
        const errorDiv = document.createElement('div')
        errorDiv.className = 'error-message'
        errorDiv.textContent = message
        field.parentNode.appendChild(errorDiv)
    }
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Función para validar contraseña
function isValidPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasMinLength = password.length >= 8
    
    return {
        valid: hasUpperCase && hasNumbers && hasMinLength,
        hasUpperCase,
        hasNumbers,
        hasMinLength
    }
}

// Función para validar teléfono
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
    return phoneRegex.test(phone)
}

// Validación en tiempo real
Object.keys(formFields).forEach(fieldName => {
    const field = formFields[fieldName]
    
    field.addEventListener('blur', () => {
        validateField(fieldName, field.value)
    })
    
    field.addEventListener('input', () => {
        // Limpiar estado de error mientras el usuario escribe
        if (field.classList.contains('error')) {
            setFieldState(field, '')
        }
    })
})

// Función de validación por campo
function validateField(fieldName, value) {
    const field = formFields[fieldName]
    
    switch(fieldName) {
        case 'name':
            if (value.trim().length < 2) {
                setFieldState(field, 'error', 'El nombre debe tener al menos 2 caracteres')
                return false
            } else {
                setFieldState(field, 'success')
                return true
            }
            
        case 'number':
            if (!isValidPhone(value)) {
                setFieldState(field, 'error', 'Ingresa un número de teléfono válido (mínimo 10 dígitos)')
                return false
            } else {
                setFieldState(field, 'success')
                return true
            }
            
        case 'email':
            if (!isValidEmail(value)) {
                setFieldState(field, 'error', 'Ingresa un correo electrónico válido')
                return false
            } else {
                setFieldState(field, 'success')
                return true
            }
            
        case 'password':
            const passwordValidation = isValidPassword(value)
            if (!passwordValidation.valid) {
                let errorMessage = 'La contraseña debe tener:'
                if (!passwordValidation.hasMinLength) errorMessage += ' • Mínimo 8 caracteres'
                if (!passwordValidation.hasUpperCase) errorMessage += ' • Al menos una mayúscula'
                if (!passwordValidation.hasNumbers) errorMessage += ' • Al menos un número'
                setFieldState(field, 'error', errorMessage)
                return false
            } else {
                setFieldState(field, 'success')
                return true
            }
    }
}

// Event listener del formulario
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Obtener valores
    const formData = {
        name: formFields.name.value.trim(),
        number: formFields.number.value.trim(),
        email: formFields.email.value.trim(),
        password: formFields.password.value
    }
    
    // Validar todos los campos
    const isNameValid = validateField('name', formData.name)
    const isNumberValid = validateField('number', formData.number)
    const isEmailValid = validateField('email', formData.email)
    const isPasswordValid = validateField('password', formData.password)
    
    // Verificar si todos los campos son válidos
    if (!isNameValid || !isNumberValid || !isEmailValid || !isPasswordValid) {
        Swal.fire({
            icon: 'error',
            title: 'Campos Inválidos',
            text: 'Por favor, corrige los errores en el formulario',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#007aff',
            customClass: {
                popup: 'swal2-popup-custom',
                title: 'swal2-title-custom',
                htmlContainer: 'swal2-html-container-custom',
                confirmButton: 'swal2-confirm-custom'
            }
        })
        return
    }
    
    // Obtener usuarios existentes
    const Users = JSON.parse(localStorage.getItem('users')) || []
    
    // Verificar si el email ya existe
    const isUserRegistered = Users.find(user => user.email === formData.email)
    if (isUserRegistered) {
        setFieldState(formFields.email, 'error', 'Este correo electrónico ya está registrado')
        Swal.fire({
            icon: 'error',
            title: 'Email ya registrado',
            text: 'Este correo electrónico ya está en uso. Intenta con otro.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#007aff',
            customClass: {
                popup: 'swal2-popup-custom',
                title: 'swal2-title-custom',
                htmlContainer: 'swal2-html-container-custom',
                confirmButton: 'swal2-confirm-custom'
            }
        })
        return
    }
    
    // Verificar si el teléfono ya existe
    const isNumberRegistered = Users.find(user => user.number === formData.number)
    if (isNumberRegistered) {
        setFieldState(formFields.number, 'error', 'Este número de teléfono ya está registrado')
        Swal.fire({
            icon: 'error',
            title: 'Teléfono ya registrado',
            text: 'Este número de teléfono ya está en uso. Intenta con otro.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#007aff',
            customClass: {
                popup: 'swal2-popup-custom',
                title: 'swal2-title-custom',
                htmlContainer: 'swal2-html-container-custom',
                confirmButton: 'swal2-confirm-custom'
            }
        })
        return
    }
    
    // Deshabilitar botón durante el proceso
    const submitBtn = document.querySelector('input[type="submit"]')
    submitBtn.disabled = true
    submitBtn.value = 'Creando cuenta...'
    
    // Simular delay para mejor UX
    setTimeout(() => {
        // Agregar nuevo usuario
        Users.push({
            name: formData.name,
            number: formData.number,
            email: formData.email,
            password: formData.password,
            createdAt: new Date().toISOString()
        })
        
    localStorage.setItem('users', JSON.stringify(Users))

        // Mostrar éxito con toast elegante
    Swal.fire({
            icon: 'success',
            title: '¡Cuenta Creada!',
            text: 'Bienvenido a Performance Radio',
            timer: 2500,
        timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            customClass: {
                popup: 'swal2-toast-custom',
                title: 'swal2-title-custom',
                htmlContainer: 'swal2-html-container-custom'
            },
        didOpen: () => {
            Swal.showLoading()
        }
        }).then(() => {
            window.location.href = 'iniciosesionLS.html'
    })
    }, 1000)
})
