const express = require("express");
const app = express();
require("dotenv").config();

const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotel.model");

app.use(express.json());

initializeDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// function to read all hotels from the database
async function readAllHotels() {
  try {
    const hotels = await Hotel.find();
    return hotels;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

// function to read a hotel by its name.
async function readHotelByName(hotelName) {
  try {
    const hotelByName = await Hotel.findOne({ name: hotelName });
    return hotelByName;
  } catch (error) {
    console.log(error);
  }
}
app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelByName(req.params.hotelName);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "No hotel found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

// function to read a hotel by phone number
async function hotelByPhoneNumber(phoneNumber) {
  try {
    const hotel = await Hotel.findOne({ phoneNumber: phoneNumber });
    return hotel;
  } catch (error) {
    console.log(error);
  }
}
app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await hotelByPhoneNumber(req.params.phoneNumber);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

// function to read all hotels with rating 4.0
async function hotelsByRating(rating) {
  try {
    const hotels = await Hotel.find({ rating: rating });
    return hotels;
  } catch (error) {
    console.log(error);
  }
}
app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await hotelsByRating(req.params.hotelRating);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

// function to read all hotels by category.
async function readAllHotelsByCategory(category) {
  try {
    const hotels = await Hotel.find({ category: category });
    return hotels;
  } catch (error) {
    console.log(error);
  }
}
app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await readAllHotelsByCategory(req.params.hotelCategory);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

// function to create new hotel data.
async function createHotel(newHotel) {
  try {
    const hotel = new Hotel(newHotel);
    const savedData = await hotel.save();
    return savedData;
  } catch (error) {
    console.log(error);
  }
}

app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body);
    if (savedHotel) {
      res.status(201).json({
        message: "New Hotel data saved successfully.",
        data: savedHotel,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// function to delete a hotel data by their ID in the Database
async function deleteHotel(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    return deletedHotel;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId);
    if (deletedHotel) {
      res.status(200).json({ message: "Hotel deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hotel." });
  }
});

// function to update a hotel data by their ID in the Database.
async function updateHotel(hotelId, updatedData) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updatedData, {
      new: true,
    });
    return updatedHotel;
  } catch (error) {
    console.log(error);
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotel(req.params.hotelId, req.body);
    if (updatedHotel) {
      res.status(200).json({
        message: "Hotel data updated successfully.",
        hotel: updatedHotel,
      });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to updated data." });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
