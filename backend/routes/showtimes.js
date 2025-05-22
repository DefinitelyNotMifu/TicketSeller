const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { checkRole } = require('../middlewares/auth');

const showtimesPath = path.join(__dirname, '../database/showTimes.json');
const filmsPath = path.join(__dirname, '../database/films.json');
const roomsPath = path.join(__dirname, '../database/rooms.json');

// Lấy danh sách xuất chiếu
router.get('/', (req, res) => {
  try {
    const showtimes = JSON.parse(fs.readFileSync(showtimesPath, 'utf8'));
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Tìm kiếm xuất chiếu
router.get('/search', (req, res) => {
  const { filmTitle, showTime, date } = req.query;
  
  try {
    const showtimes = JSON.parse(fs.readFileSync(showtimesPath, 'utf8'));
    let filtered = showtimes;

    if (filmTitle) {
      filtered = filtered.filter(st => st.filmTitle.toLowerCase().includes(filmTitle.toLowerCase()));
    }
    if (showTime) {
      filtered = filtered.filter(st => st.showTime === showTime);
    }
    if (date) {
      filtered = filtered.filter(st => st.date === date);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm xuất chiếu mới (chỉ quản lý)
router.post('/', checkRole(['manager']), (req, res) => {
  const { filmId, roomId, date, showTime } = req.body;
  
  try {
    const showtimes = JSON.parse(fs.readFileSync(showtimesPath, 'utf8'));
    const films = JSON.parse(fs.readFileSync(filmsPath, 'utf8'));
    const rooms = JSON.parse(fs.readFileSync(roomsPath, 'utf8'));

    const film = films.films.find(f => f.id === filmId);
    const room = rooms.rooms.find(r => r.id === roomId);

    if (!film || !room) {
      return res.status(400).json({ message: 'Phim hoặc phòng không tồn tại' });
    }

    const newShowtime = {
      id: showtimes.length + 1,
      filmId,
      filmTitle: film.title,
      roomId,
      roomName: room.name,
      date,
      showTime,
      availableSeats: room.seats,
      soldSeats: 0
    };

    showtimes.push(newShowtime);
    fs.writeFileSync(showtimesPath, JSON.stringify(showtimes, null, 2));
    
    res.json(newShowtime);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Bán vé (chỉ nhân viên bán vé)
router.post('/:id/sell', checkRole(['ticket_seller']), (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  
  try {
    const showtimes = JSON.parse(fs.readFileSync(showtimesPath, 'utf8'));
    const showtime = showtimes.find(st => st.id === parseInt(id));

    if (!showtime) {
      return res.status(404).json({ message: 'Không tìm thấy xuất chiếu' });
    }

    if (showtime.availableSeats < quantity) {
      return res.status(400).json({ message: 'Không đủ ghế' });
    }

    showtime.availableSeats -= quantity;
    showtime.soldSeats += quantity;

    fs.writeFileSync(showtimesPath, JSON.stringify(showtimes, null, 2));
    
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thống kê bán vé (chỉ quản lý)
router.get('/statistics', checkRole(['manager']), (req, res) => {
  const { month } = req.query;
  
  try {
    const showtimes = JSON.parse(fs.readFileSync(showtimesPath, 'utf8'));
    
    const filteredShowtimes = showtimes.filter(st => {
      const showDate = new Date(st.date);
      return showDate.getMonth() + 1 === parseInt(month);
    });

    const totalTickets = filteredShowtimes.reduce((sum, st) => sum + st.soldSeats, 0);
    
    const statistics = {
      month,
      totalTickets,
      showtimes: filteredShowtimes.map(st => ({
        showTime: st.showTime,
        soldTickets: st.soldSeats,
        percentage: ((st.soldSeats / totalTickets) * 100).toFixed(2)
      }))
    };

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router; 