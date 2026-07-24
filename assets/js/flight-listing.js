// Hàm render danh sách vé
function renderTickets(ticketsData) {
  const container = document.getElementById('ticket-list');
  const template = document.getElementById('ticket-template');

  // Xóa nội dung cũ trước khi render
  container.innerHTML = '';

  ticketsData.forEach(ticket => {
    // Clone khung mẫu HTML
    const clone = template.content.cloneNode(true);

    // Đổ dữ liệu chung vào Card
    clone.querySelector('.airline-logo').src = ticket.airlineLogo;
    clone.querySelector('.airline-logo').alt = ticket.airlineName;
    clone.querySelector('.rating-score').textContent = ticket.rating;
    clone.querySelector('.rating-text').textContent = ticket.ratingText;
    clone.querySelector('.review-count').textContent = `${ticket.reviewsCount} reviews`;
    clone.querySelector('.price-value').textContent = `$${ticket.price}`;

    // Đổ dữ liệu danh sách chuyến bay (Flight rows)
    const flightsContainer = clone.querySelector('.flights-container');
    ticket.flights.forEach(flight => {
      const flightRow = document.createElement('div');
      flightRow.className = 'flight-row';
      flightRow.innerHTML = `
        <input type="checkbox" class="flight-check">
        <div class="flight-time">
          <strong>${flight.time}</strong>
          <span>${flight.airline}</span>
        </div>
        <div class="flight-type">${flight.type}</div>
        <div class="flight-duration">
          <strong>${flight.duration}</strong>
          <span>${flight.route}</span>
        </div>
      `;
      flightsContainer.appendChild(flightRow);
    });

    // Thêm Card đã hoàn chỉnh vào giao diện
    container.appendChild(clone);
  });
}

// Giả lập gọi API từ server
async function fetchFlightTickets() {
  try {
    // Thay URL bên dưới bằng API thật của bạn
    // const response = await fetch('https://api.your-domain.com/flights');
    // const data = await response.json();

    // Dữ liệu mẫu minh họa từ API
    const mockApiData = [
      {
        airlineName: 'Emirates',
        airlineLogo: 'assets/image/image 40.png',
        rating: 4.2,
        ratingText: 'Very Good',
        reviewsCount: 54,
        price: 107,
        flights: [
          { time: '12:00 pm - 01:28 pm', airline: 'Emirates', type: 'non stop', duration: '2h 28m', route: 'EWR-BNA' },
          { time: '05:00 pm - 06:28 pm', airline: 'Emirates', type: 'non stop', duration: '2h 28m', route: 'BNA-EWR' }
        ]
      },
      {
        airlineName: 'Flydubai',
        airlineLogo: 'assets/image/image 41.png',
        rating: 4.2,
        ratingText: 'Verygood',
        reviewsCount: 54,
        price: 107,
        flights: [
          { time: '12:00 pm - 01:28 pm', airline: 'Emirates', type: 'non stop', duration: '2h 28m', route: 'EWR-BNA' },
          { time: '05:00 pm - 06:28 pm', airline: 'Emirates', type: 'non stop', duration: '2h 28m', route: 'BNA-EWR' }
        ]
      },
         {
        airlineName: 'Qatar Airways',
        airlineLogo: 'assets/image/image 43.png',
        rating: 4.2,
        ratingText: 'Verygood',
        reviewsCount: 54,
        price: 107,
        flights: [
          { time: '12:00 pm - 01:28 pm', airline: 'Emirates', type: 'non stop', duration: '2h 28m', route: 'EWR-BNA' },
          { time: '05:00 pm - 06:28 pm', airline: 'Emirates', type: 'non stop', duration: '2h 28m', route: 'BNA-EWR' }
        ]
      },
       {
        airlineName: 'Etihad',
        airlineLogo: 'assets/image/image 45.png',
        rating: 4.2,
        ratingText: 'Verygood',
        reviewsCount: 54,
        price: 107,
        flights: [
          { time: '12:00 pm - 01:28 pm', airline: 'Emirates', type: 'non stop', duration: '2h 28m', route: 'EWR-BNA' },
          { time: '05:00 pm - 06:28 pm', airline: 'Emirates', type: 'non stop', duration: '2h 28m', route: 'BNA-EWR' }
        ]
      },
    ];

    renderTickets(mockApiData);
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu chuyến bay:', error);
  }
}

// Gọi hàm chạy khi trang tải xong
document.addEventListener('DOMContentLoaded', fetchFlightTickets);