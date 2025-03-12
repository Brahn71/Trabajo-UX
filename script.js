/****************** USUARIOS ******************/
let users = [];           // Almacena usuarios registrados
let currentUser = null;   // Usuario logueado

/****************** DATOS DE INVENTARIO ******************/
let items = [];           // Array donde guardaremos los ítems
let currentItemIndex = -1; // Índice del ítem en edición

/* ---------- MOSTRAR/OCULTAR SECCIONES DE LOGIN/REGISTRO ---------- */
function showRegister() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('register-container').style.display = 'block';
}

function showLogin() {
  document.getElementById('register-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}

/* ---------- REGISTRAR USUARIO ---------- */
function register() {
  let name = document.getElementById('register-name').value;
  let email = document.getElementById('register-email').value;
  let password = document.getElementById('register-password').value;
  let confirmPassword = document.getElementById('confirm-password').value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Todos los campos son obligatorios");
    return;
  }

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  // Verificar si el usuario ya existe
  let exists = users.some(u => u.email === email);
  if (exists) {
    alert("Ya existe un usuario con este correo");
    return;
  }

  // Registrar nuevo usuario
  users.push({ name, email, password });
  alert("Usuario registrado con éxito");
  showLogin();
}

/* ---------- LOGIN ---------- */
function login() {
  let email = document.getElementById('login-email').value;
  let password = document.getElementById('login-password').value;

  let user = users.find(u => u.email === email && u.password === password);
  if (user) {
    alert("Login exitoso");
    currentUser = user;
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('inventory-container').style.display = 'block';
    document.getElementById('user-name').innerText = user.name;
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

/****************** FUNCIONES PARA EL INVENTARIO ******************/

function refreshTable(filteredItems = null) {
  let tbody = document.querySelector('#inventory-table tbody');
  tbody.innerHTML = '';

  let dataToRender = filteredItems || items;

  dataToRender.forEach((item, index) => {
    let row = document.createElement('tr');

    let tdNombre = document.createElement('td');
    tdNombre.textContent = item.nombre;

    let tdEstado = document.createElement('td');
    tdEstado.textContent = item.estado;

    let tdDesc = document.createElement('td');
    tdDesc.textContent = item.descripcion;

    let tdTipo = document.createElement('td');
    tdTipo.textContent = item.tipo;

    let tdModelo = document.createElement('td');
    tdModelo.textContent = item.modelo;

    let tdGestionar = document.createElement('td');
    let btnGestionar = document.createElement('button');
    btnGestionar.textContent = 'Gestionar';
    btnGestionar.className = 'btn-gestionar';
    btnGestionar.onclick = () => showManageModal(index);
    tdGestionar.appendChild(btnGestionar);

    row.appendChild(tdNombre);
    row.appendChild(tdEstado);
    row.appendChild(tdDesc);
    row.appendChild(tdTipo);
    row.appendChild(tdModelo);
    row.appendChild(tdGestionar);

    tbody.appendChild(row);
  });
}

function showAddModal() {
  document.getElementById('add-modal').style.display = 'block';
}

function closeAddModal() {
  document.getElementById('add-modal').style.display = 'none';
  document.getElementById('add-nombre').value = '';
  document.getElementById('add-estado').value = 'Nuevo';
  document.getElementById('add-fecha').value = '';
  document.getElementById('add-localizacion').value = '';
  document.getElementById('add-tipo').value = '';
  document.getElementById('add-modelo').value = '';
  document.getElementById('add-descripcion').value = '';
}

function saveItem() {
  let nombre = document.getElementById('add-nombre').value;
  let estado = document.getElementById('add-estado').value;
  let fecha = document.getElementById('add-fecha').value;
  let localizacion = document.getElementById('add-localizacion').value;
  let tipo = document.getElementById('add-tipo').value;
  let modelo = document.getElementById('add-modelo').value;
  let descripcion = document.getElementById('add-descripcion').value;

  items.push({
    nombre,
    estado,
    fechaEntrada: fecha,
    localizacion,
    tipo,
    modelo,
    descripcion,
    estante: '',
    prestarA: '',
    cartaResguardo: ''
  });

  refreshTable();
  closeAddModal();
}

function showManageModal(index) {
  currentItemIndex = index;
  let item = items[index];

  document.getElementById('manage-nombre').value = item.nombre;
  document.getElementById('manage-tipo').value = item.tipo;
  document.getElementById('manage-estante').value = item.estante || '';
  document.getElementById('manage-estado').value = item.estado;
  document.getElementById('manage-descripcion').value = item.descripcion;
  document.getElementById('manage-localizacion').value = item.localizacion;
  document.getElementById('manage-prestar').value = item.prestarA || '';
  document.getElementById('manage-carta').value = item.cartaResguardo || '';
  document.getElementById('manage-fecha').value = item.fechaEntrada || '';

  document.getElementById('manage-modal').style.display = 'block';
}

function closeManageModal() {
  document.getElementById('manage-modal').style.display = 'none';
}

function editItem() {
  alert("Puedes editar los campos y luego presionar 'Guardar' para confirmar.");
}

function saveManageChanges() {
  if (currentItemIndex < 0) return;
  let item = items[currentItemIndex];
  item.nombre = document.getElementById('manage-nombre').value;
  item.tipo = document.getElementById('manage-tipo').value;
  item.estante = document.getElementById('manage-estante').value;
  item.estado = document.getElementById('manage-estado').value;
  item.descripcion = document.getElementById('manage-descripcion').value;
  item.localizacion = document.getElementById('manage-localizacion').value;
  item.prestarA = document.getElementById('manage-prestar').value;
  item.cartaResguardo = document.getElementById('manage-carta').value;
  item.fechaEntrada = document.getElementById('manage-fecha').value;

  refreshTable();
  closeManageModal();
}

function deleteItem() {
  if (currentItemIndex < 0) return;
  if (confirm("¿Seguro que deseas eliminar este ítem?")) {
    items.splice(currentItemIndex, 1);
    refreshTable();
    closeManageModal();
  }
}

function showFilterModal() {
  document.getElementById('filter-modal').style.display = 'block';
}

function closeFilterModal() {
  document.getElementById('filter-modal').style.display = 'none';
  document.getElementById('filter-nombre').value = '';
  refreshTable();
}

function applyFilter() {
  let filterName = document.getElementById('filter-nombre').value.toLowerCase().trim();
  if (filterName === '') {
    alert("Ingresa un nombre para filtrar");
    return;
  }
  let filtered = items.filter(item => 
    item.nombre.toLowerCase().includes(filterName)
  );
  refreshTable(filtered);
  closeFilterModal();
}
