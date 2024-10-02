 // En este archivo tenemos la lógica de boletos y asientos.
// Los patrones de diseño que uso son: Factory y Singleton.

//  Factory method 
class Ticket {
    constructor(type, price) {
        this.type = type;
        this.price = price;
    }
}

class TicketFactory {
    createTicket(type) {
        // Según el tipo que el usuario seleccione, creo el boleto con el precio que le asignare
        switch(type) {
            case 'adult':
                return new Ticket('Adulto', 8.00);
            case 'child':
                return new Ticket('Niño', 5.00);
            case 'senior':
                return new Ticket('Tercera Edad', 6.00);
            default:
                throw new Error('Tipo de boleto no válido');
        }
    }
}

// Singleton method

class SeatManager {
    constructor() {
        // Creo un arreglo con 20 asientos. Todos empiezan como disponibles.
        if (!SeatManager.instance) {
            this.seats = Array(20).fill(null).map((_, i) => ({
                id: i + 1,
                isAvailable: true
            }));
            SeatManager.instance = this;
        }
        return SeatManager.instance;
    }

    // Devuelvo los asientos disponibles para que el usuario pueda escogerlos.
    getAvailableSeats() {
        return this.seats;
    }

    // Este método cambia el estado del asiento a "no disponible" cuando el usuario lo selecciona.
    selectSeat(seatId) {
        const seat = this.seats.find(s => s.id === seatId);
        if (seat && seat.isAvailable) {
            seat.isAvailable = false;  // Aqui hace que se muestre el asiento como "seleccionado"
            return true;
        }
        return false;
    }
}

// Aquí hago que solo exista una instancia de SeatManager en todo el programa.
const seatManager = new SeatManager();
Object.freeze(seatManager); 

//  Lógica de la aplicación (Interacción con el DOM) es para motrar a las personas los que estan disponibles(algo nuevo que aprendi)

// Instancio la fábrica de boletos
const ticketFactory = new TicketFactory();
const purchaseButton = document.getElementById('purchase-button');
const seatContainer = document.getElementById('seats');
const refreshButton = document.getElementById('refresh-button');

// Función que muestra los asientos en la página web
function renderSeats() {
    seatContainer.innerHTML = ''; 

    const seats = seatManager.getAvailableSeats();
    
    // Para cada asiento, creo un elemento 'div' que lo representa visualmente.
    seats.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');
        seatElement.textContent = `Asiento ${seat.id}`;

        // Si el asiento ya está seleccionado, lo marco como "vendido".
        if (!seat.isAvailable) {
            seatElement.classList.add('sold');
        } else {
            // Si el asiento está disponible, estara para que lo seleccionen.
            seatElement.addEventListener('click', () => {
                if (seatManager.selectSeat(seat.id)) {
                    seatElement.classList.add('selected');
                    seatElement.textContent = `Asiento ${seat.id} - Seleccionado`;
                }
            });
        }

        seatContainer.appendChild(seatElement);
    });
}

// Inicializamos los asientos cuando cargamos la página.
renderSeats();

// Manejo del botón para comprar boletos
purchaseButton.addEventListener('click', () => {
    const ticketType = document.getElementById('ticket-type').value;
    const ticket = ticketFactory.createTicket(ticketType);  // Creamos el boleto usando el Factory method
    alert(`Has comprado un boleto de ${ticket.type} por $${ticket.price}`);
});

// Botón para refrescar la página y empezar de nuevo a seleccionar 
refreshButton.addEventListener('click', () => {
    window.location.reload();  
});
