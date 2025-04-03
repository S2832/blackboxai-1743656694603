// Sample data for local messes
const messes = [
    {
        id: 1,
        name: "College Mess #1",
        image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
        rating: 4.5,
        reviews: 120,
        distance: "1.2 km",
        price: "₹50 per meal",
        type: "Veg",
        menu: [
            { id: 1, name: "Vegetable Curry", price: 45, image: "https://images.pexels.com/photos/725990/pexels-photo-725990.jpeg" },
            { id: 2, name: "Dal Fry", price: 30, image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg" }
        ]
    },
    {
        id: 2,
        name: "Hostel Mess",
        image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
        rating: 4.2,
        reviews: 85,
        distance: "0.8 km",
        price: "₹60 per meal",
        type: "Veg & Non-Veg",
        menu: [
            { id: 1, name: "Chicken Curry", price: 70, image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg" },
            { id: 2, name: "Paneer Butter Masala", price: 65, image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg" }
        ]
    }
];

// Store sample data in localStorage
localStorage.setItem('messes', JSON.stringify(messes));

// Function to load messes on home page
function loadMesses() {
    const messContainer = document.querySelector('.grid');
    const storedMesses = JSON.parse(localStorage.getItem('messes')) || [];
    
    storedMesses.forEach(mess => {
        const messCard = document.createElement('div');
        messCard.className = 'bg-white shadow-md rounded-lg overflow-hidden';
        messCard.innerHTML = `
            <img src="${mess.image}" alt="${mess.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <div class="flex justify-between items-start">
                    <h3 class="text-lg font-semibold">${mess.name}</h3>
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">${mess.type}</span>
                </div>
                <div class="flex items-center mt-1">
                    <span class="text-yellow-500">★ ${mess.rating}</span>
                    <span class="text-gray-500 text-sm ml-2">(${mess.reviews} reviews)</span>
                </div>
                <p class="text-gray-600 mt-2">${mess.distance} • ${mess.price}</p>
                <button onclick="viewMenu(${mess.id})" class="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                    View Menu
                </button>
            </div>
        `;
        messContainer.appendChild(messCard);
    });
}

// Function to view mess menu
function viewMenu(messId) {
    localStorage.setItem('currentMess', messId);
    window.location.href = 'mess-details.html';
}

// Function to load mess menu
function loadMessMenu() {
    const messId = localStorage.getItem('currentMess');
    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const currentMess = messes.find(m => m.id == messId);
    
    if (!currentMess) {
        window.location.href = 'index.html';
        return;
    }

    // Display mess info
    const messInfo = document.getElementById('messInfo');
    if (messInfo) {
        messInfo.innerHTML = `
            <h2 class="text-2xl font-bold mb-2">${currentMess.name}</h2>
            <div class="flex items-center mb-2">
                <span class="text-yellow-500">★ ${currentMess.rating}</span>
                <span class="text-gray-500 text-sm ml-2">(${currentMess.reviews} reviews)</span>
                <span class="ml-4 text-gray-600">${currentMess.distance} away</span>
            </div>
            <p class="text-gray-700">${currentMess.type} • ${currentMess.price}</p>
        `;
    }

    // Display menu items
    const menuContainer = document.getElementById('menuItems');
    if (menuContainer) {
        currentMess.menu.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-full h-40 object-cover mb-3 rounded">
                <h3 class="text-lg font-semibold">${item.name}</h3>
                <p class="text-gray-600 mb-2">₹ ${item.price}</p>
                <button onclick="addToCart(${messId}, ${item.id})" 
                        class="w-full bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                    Add to Cart
                </button>
            `;
            menuContainer.appendChild(menuItem);
        });
    }
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(messId, itemId) {
    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const mess = messes.find(m => m.id == messId);
    const item = mess.menu.find(i => i.id == itemId);
    
    const existingItem = cart.find(i => i.messId == messId && i.itemId == itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            messId,
            messName: mess.name,
            itemId,
            itemName: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showFloatingCart();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    const floatingCount = document.getElementById('floatingCartCount');
    
    if (cartCount) cartCount.textContent = count;
    if (floatingCount) floatingCount.textContent = count;
}

function showFloatingCart() {
    const floatingCart = document.getElementById('floatingCart');
    if (floatingCart) {
        floatingCart.classList.remove('hidden');
        floatingCart.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
}

function loadCartPage() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center py-8">Your cart is empty</p>';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `
            <div class="border-b border-gray-200 py-4">
                <div class="flex justify-between">
                    <div>
                        <h4 class="font-medium">${item.itemName}</h4>
                        <p class="text-sm text-gray-600">${item.messName}</p>
                    </div>
                    <div class="text-right">
                        <p>₹${item.price * item.quantity}</p>
                        <div class="flex items-center justify-end mt-1">
                            <button onclick="updateQuantity(${item.messId}, ${item.itemId}, -1)" 
                                    class="px-2 bg-gray-200 rounded">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.messId}, ${item.itemId}, 1)" 
                                    class="px-2 bg-gray-200 rounded">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = html;
    document.getElementById('cartTotal').textContent = `₹${total}`;
}

function updateQuantity(messId, itemId, change) {
    const item = cart.find(i => i.messId == messId && i.itemId == itemId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => !(i.messId == messId && i.itemId == itemId));
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartPage();
    updateCartCount();
}

// User authentication
const users = JSON.parse(localStorage.getItem('users')) || [
    { id: 1, email: 'user@example.com', password: 'password123', name: 'John Doe', type: 'customer' },
    { id: 2, email: 'admin@example.com', password: 'admin123', name: 'Admin', type: 'admin' }
];

function loginUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function registerUser(name, email, password) {
    const userExists = users.some(u => u.email === email);
    if (userExists) return false;
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        type: 'customer'
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Mess management functions
function openAddMessModal() {
    document.getElementById('addMessModal').classList.remove('hidden');
}

function closeAddMessModal() {
    document.getElementById('addMessModal').classList.add('hidden');
}

function loadMessesTable() {
    const user = getCurrentUser();
    if (!user || user.type !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const table = document.getElementById('messesTable');
    
    table.innerHTML = messes.map(mess => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" src="${mess.image}" alt="${mess.name}">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${mess.name}</div>
                        <div class="text-sm text-gray-500">${mess.distance} away</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mess.type === 'Veg' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                    ${mess.type}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${mess.price}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <span class="text-yellow-500">★ ${mess.rating}</span>
                    <span class="text-gray-500 text-xs ml-1">(${mess.reviews})</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editMess(${mess.id})" class="text-green-600 hover:text-green-900 mr-3">Edit</button>
                <button onclick="deleteMess(${mess.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        </tr>
    `).join('');

    // Handle add mess form
    const form = document.getElementById('addMessForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewMess(
                document.getElementById('messName').value,
                document.getElementById('messType').value,
                document.getElementById('messPrice').value
            );
        });
    }
}

function addNewMess(name, type, price) {
    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const newMess = {
        id: Date.now(),
        name,
        image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
        rating: 4.0,
        reviews: 0,
        distance: "1.0 km",
        price: `₹${price} per meal`,
        type,
        menu: []
    };
    
    messes.push(newMess);
    localStorage.setItem('messes', JSON.stringify(messes));
    closeAddMessModal();
    loadMessesTable();
}

// Edit Mess Modal
let currentEditMessId = null;

function openEditMessModal(id) {
    currentEditMessId = id;
    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const mess = messes.find(m => m.id === id);
    
    if (mess) {
        document.getElementById('editMessName').value = mess.name;
        document.getElementById('editMessType').value = mess.type;
        document.getElementById('editMessPrice').value = parseInt(mess.price.replace('₹', '').replace(' per meal', ''));
        document.getElementById('editMessModal').classList.remove('hidden');
    }
}

function closeEditMessModal() {
    document.getElementById('editMessModal').classList.add('hidden');
}

function editMess(id) {
    openEditMessModal(id);
}

function saveEditedMess() {
    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const messIndex = messes.findIndex(m => m.id === currentEditMessId);
    
    if (messIndex !== -1) {
        messes[messIndex] = {
            ...messes[messIndex],
            name: document.getElementById('editMessName').value,
            type: document.getElementById('editMessType').value,
            price: `₹${document.getElementById('editMessPrice').value} per meal`
        };
        
        localStorage.setItem('messes', JSON.stringify(messes));
        closeEditMessModal();
        loadMessesTable();
    }
}

function deleteMess(id) {
    if (confirm('Are you sure you want to delete this mess?')) {
        const messes = JSON.parse(localStorage.getItem('messes')) || [];
        const updatedMesses = messes.filter(mess => mess.id !== id);
        localStorage.setItem('messes', JSON.stringify(updatedMesses));
        loadMessesTable();
    }
}

// Menu management functions
let currentMessId = null;

function openAddMenuItemModal() {
    document.getElementById('addMenuItemModal').classList.remove('hidden');
}

function closeAddMenuItemModal() {
    document.getElementById('addMenuItemModal').classList.add('hidden');
}

function openEditMenuItemModal(id) {
    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const mess = messes.find(m => m.id === currentMessId);
    const item = mess?.menu?.find(i => i.id === id);
    
    if (item) {
        document.getElementById('editItemId').value = id;
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemPrice').value = item.price;
        document.getElementById('editItemImage').value = item.image || '';
        document.getElementById('editMenuItemModal').classList.remove('hidden');
    }
}

function closeEditMenuItemModal() {
    document.getElementById('editMenuItemModal').classList.add('hidden');
}

function loadMenuItems() {
    const user = getCurrentUser();
    if (!user || user.type !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // Get mess ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentMessId = parseInt(urlParams.get('messId'));
    
    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const mess = messes.find(m => m.id === currentMessId);
    
    if (!mess) {
        window.location.href = 'admin-messes.html';
        return;
    }

    document.getElementById('currentMessName').textContent = mess.name;
    const table = document.getElementById('menuItemsTable');
    
    if (mess.menu && mess.menu.length > 0) {
        table.innerHTML = mess.menu.map(item => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full" src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${item.name}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹${item.price}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="openEditMenuItemModal(${item.id})" class="text-green-600 hover:text-green-900 mr-3">Edit</button>
                    <button onclick="deleteMenuItem(${item.id})" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            </tr>
        `).join('');
    } else {
        table.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No menu items found</td></tr>';
    }

    // Handle add menu item form
    const addForm = document.getElementById('addMenuItemForm');
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewMenuItem(
                document.getElementById('itemName').value,
                document.getElementById('itemPrice').value,
                document.getElementById('itemImage').value
            );
        });
    }

    // Handle edit menu item form
    const editForm = document.getElementById('editMenuItemForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveEditedMenuItem(
                parseInt(document.getElementById('editItemId').value),
                document.getElementById('editItemName').value,
                document.getElementById('editItemPrice').value,
                document.getElementById('editItemImage').value
            );
        });
    }
}

function addNewMenuItem(name, price, image) {
    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const messIndex = messes.findIndex(m => m.id === currentMessId);
    
    if (messIndex !== -1) {
        const newItem = {
            id: Date.now(),
            name,
            price: parseInt(price),
            image: image || 'https://via.placeholder.com/150'
        };
        
        if (!messes[messIndex].menu) {
            messes[messIndex].menu = [];
        }
        
        messes[messIndex].menu.push(newItem);
        localStorage.setItem('messes', JSON.stringify(messes));
        closeAddMenuItemModal();
        loadMenuItems();
    }
}

function saveEditedMenuItem(id, name, price, image) {
    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const messIndex = messes.findIndex(m => m.id === currentMessId);
    
    if (messIndex !== -1) {
        const itemIndex = messes[messIndex].menu.findIndex(i => i.id === id);
        if (itemIndex !== -1) {
            messes[messIndex].menu[itemIndex] = {
                ...messes[messIndex].menu[itemIndex],
                name,
                price: parseInt(price),
                image: image || 'https://via.placeholder.com/150'
            };
            
            localStorage.setItem('messes', JSON.stringify(messes));
            closeEditMenuItemModal();
            loadMenuItems();
        }
    }
}

function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        const messes = JSON.parse(localStorage.getItem('messes')) || [];
        const messIndex = messes.findIndex(m => m.id === currentMessId);
        
        if (messIndex !== -1) {
            messes[messIndex].menu = messes[messIndex].menu.filter(item => item.id !== id);
            localStorage.setItem('messes', JSON.stringify(messes));
            loadMenuItems();
        }
    }
}

// Order management functions
let currentOrderId = null;

function openOrderDetailsModal(id) {
    currentOrderId = id;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === id);
    
    if (order) {
        document.getElementById('orderDetailsId').textContent = order.id;
        document.getElementById('orderCustomer').textContent = order.customer || 'Guest';
        document.getElementById('orderDate').textContent = `Date: ${order.date}`;
        document.getElementById('orderStatus').textContent = `Status: ${order.status}`;
        document.getElementById('orderTotal').textContent = `₹${order.total}`;
        
        const itemsContainer = document.getElementById('orderItems');
        itemsContainer.innerHTML = order.items.map(item => `
            <div class="flex justify-between border-b pb-2">
                <div>
                    <p class="font-medium">${item.quantity}x ${item.itemName}</p>
                    <p class="text-sm text-gray-500">${item.messName}</p>
                </div>
                <div class="text-right">
                    <p>₹${item.price * item.quantity}</p>
                </div>
            </div>
        `).join('');
        
        document.getElementById('orderDetailsModal').classList.remove('hidden');
    }
}

function closeOrderDetailsModal() {
    document.getElementById('orderDetailsModal').classList.add('hidden');
}

function updateOrderStatus(status) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === currentOrderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        closeOrderDetailsModal();
        loadOrdersTable();
    }
}

function filterOrders() {
    const filter = document.getElementById('orderFilter').value;
    loadOrdersTable(filter);
}

function loadOrdersTable(filter = 'all') {
    const user = getCurrentUser();
    if (!user || user.type !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    const table = document.getElementById('ordersTable');
    
    if (filteredOrders.length > 0) {
        table.innerHTML = filteredOrders.map(order => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#${order.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.customer || 'Guest'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.items[0]?.messName || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.items.length} items</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹${order.total}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }">
                        ${order.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="openOrderDetailsModal(${order.id})" class="text-green-600 hover:text-green-900">View</button>
                </td>
            </tr>
        `).join('');
    } else {
        table.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No orders found</td></tr>';
    }
}

// User management functions
let currentEditUserId = null;

function openEditUserModal(id) {
    currentEditUserId = id;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === id);
    
    if (user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserType').value = user.type;
        document.getElementById('editUserModal').classList.remove('hidden');
    }
}

function closeEditUserModal() {
    document.getElementById('editUserModal').classList.add('hidden');
}

function saveEditedUser() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentEditUserId);
    
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            name: document.getElementById('editUserName').value,
            email: document.getElementById('editUserEmail').value,
            type: document.getElementById('editUserType').value
        };
        
        localStorage.setItem('users', JSON.stringify(users));
        closeEditUserModal();
        loadUsersTable();
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        loadUsersTable();
    }
}

function filterUsers() {
    const filter = document.getElementById('userFilter').value;
    loadUsersTable(filter);
}

function loadUsersTable(filter = 'all') {
    const user = getCurrentUser();
    if (!user || user.type !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const filteredUsers = filter === 'all' ? users : users.filter(u => u.type === filter);
    const table = document.getElementById('usersTable');
    
    if (filteredUsers.length > 0) {
        table.innerHTML = filteredUsers.map(user => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span class="text-gray-600">${user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${user.name}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${user.email}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.type === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }">
                        ${user.type}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="openEditUserModal(${user.id})" class="text-green-600 hover:text-green-900 mr-3">Edit</button>
                    <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            </tr>
        `).join('');

        // Handle edit user form
        const form = document.getElementById('editUserForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                saveEditedUser();
            });
        }
    } else {
        table.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No users found</td></tr>';
    }
}

function loadAdminDashboard() {
    const user = getCurrentUser();
    if (!user || user.type !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // Set admin name
    document.getElementById('adminName').textContent = user.name;

    // Load stats
    const messes = JSON.parse(localStorage.getItem('messes')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    document.getElementById('totalMesses').textContent = messes.length;
    document.getElementById('totalUsers').textContent = users.length;
    
    // Count today's orders
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => new Date(order.date).toDateString() === today);
    document.getElementById('todayOrders').textContent = todayOrders.length;

    // Load recent orders
    const recentOrdersContainer = document.getElementById('recentOrders');
    const recentOrders = orders.slice(0, 5).reverse();
    
    recentOrdersContainer.innerHTML = recentOrders.map(order => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#${order.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.items[0]?.messName || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.items.length} items</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹${order.total}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${order.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (loginUser(email, password)) {
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }

    // Handle registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (registerUser(name, email, password)) {
                window.location.href = 'index.html';
            } else {
                alert('Email already registered');
            }
        });
    }

    // Load appropriate page content
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadMesses();
    } else if (window.location.pathname.includes('mess-details.html')) {
        loadMessMenu();
        updateCartCount();
    } else if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
        updateCartCount();
    } else if (window.location.pathname.includes('order-confirmation.html')) {
        loadOrderConfirmation();
    }
});

function loadOrderConfirmation() {
    const orderId = localStorage.getItem('currentOrder');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id == orderId);
    
    if (!order) {
        document.getElementById('orderDetails').innerHTML = '<p>Order details not found</p>';
        return;
    }
    
    let html = `
        <div class="mb-4">
            <h3 class="font-semibold">Order #${order.id}</h3>
            <p class="text-sm text-gray-600">${order.date}</p>
        </div>
        <div class="mb-2">
            <p class="font-medium">Status: <span class="text-green-500">${order.status}</span></p>
        </div>
        <div class="border-t border-gray-200 pt-4 mb-4">
            <h4 class="font-medium mb-2">Items:</h4>
    `;
    
    order.items.forEach(item => {
        html += `
            <div class="flex justify-between mb-1">
                <span>${item.quantity}x ${item.itemName}</span>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `;
    });
    
    html += `
        </div>
        <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹${order.total}</span>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetails').innerHTML = html;
}
