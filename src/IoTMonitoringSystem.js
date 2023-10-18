import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Card,
  CardContent,
  CardMedia,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const IoTMonitoringSystem = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardData, setCardData] = useState([
    {
      image: '/images/temp5.jpg',
      background: 'rgb(190 190 190 / 52%)',
      label: 'Temperature',
      value: 'Fetching...',
      time: 'calculating..',
    },
    {
      image: '/images/pre.jpg',
      background: 'rgb(96 96 96 / 32%)',
      label: 'Pressure',
      value: 'Fetching...',
      time: 'calculating..',
    },
    {
      image: '/images/alt.jpg',
      background: 'rgb(96 96 96 / 32%)',
      label: 'Altitude',
      value: 'Fetching...',
      time: 'calculating..',
    },
  ]);
  const [isAnimating, setIsAnimating] = useState(true);

  const swipeRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cardData.length);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [cardData, isAnimating]);

  const fetchDataAndUpdateCards = async () => {
    try {
      const temperatureResponse = await fetch(
        'https://io.adafruit.com/api/v2/akshaypsmec/feeds/tempt'
      );
      const pressureResponse = await fetch(
        'https://io.adafruit.com/api/v2/akshaypsmec/feeds/pressure'
      );
      const altitudeResponse = await fetch(
        'https://io.adafruit.com/api/v2/akshaypsmec/feeds/altitude'
      );

      if (temperatureResponse.ok && pressureResponse.ok && altitudeResponse.ok) {
        const temperatureData = await temperatureResponse.json();
        const pressureData = await pressureResponse.json();
        const altitudeData = await altitudeResponse.json();

        const convertGMTtoIST = (timestamp) => {
          const date = new Date(timestamp);
          date.setMinutes(date.getMinutes() + 330); // +5:30
          return date;
        };

        setCardData((prevData) => [
          {
            ...prevData[0],
            value: temperatureData.last_value+" °C",
            time: convertGMTtoIST(temperatureData.updated_at).toLocaleString(),
          },
          {
            ...prevData[1],
            value: pressureData.last_value+" Pa",
            time: convertGMTtoIST(temperatureData.updated_at).toLocaleString(),
          },
          {
            ...prevData[2],
            value: altitudeData.last_value+" m",
            time: convertGMTtoIST(temperatureData.updated_at).toLocaleString(),
          },
        ]);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataAndUpdateCards();
    const dataFetchInterval = setInterval(fetchDataAndUpdateCards, 3000);

    return () => clearInterval(dataFetchInterval);
  }, []);

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cardData.length);
    } else if (direction === 'right') {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + cardData.length) % cardData.length);
    }
  };

  const handleTouchStart = () => {
    setIsAnimating(false);
  };

  const handleTouchEnd = () => {
    setIsAnimating(true);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={swipeRef}
    >
      <CssBaseline />
      <AppBar style={{ background: 'aliceblue' }} position="sticky">
        <Toolbar>
          <img src="./images/smeclogo.png" alt="Logo" style={{ height: '19px', marginRight: '16px' }} />
          <Typography style={{ color: '#575757', fontWeight: 550 ,'font-size': 'large'}} variant="h6">
            Wheather monitoring system
          </Typography>
        </Toolbar>
      </AppBar>
      <div
        style={{
          display: 'flex',
          overflowX: 'hidden',
          height: '613px',
          position: 'relative',
        }}
      >
        {cardData.map((card, index) => (
          <Card
            key={index}
            style={{
              flex: '0 0 auto',
              width: 'calc(33.33% - 32px)',
              minWidth: '340px',
              margin: '16px',
              borderRadius: '28px',
              boxShadow: '4px 8px 20px 0px',
              position: 'absolute',
              left: `${(index - currentIndex) * 100}%`,
              transition: 'left 0.5s',
              zIndex: 2,
            }}
          >
            <CardMedia component="img" alt={`Photo ${index + 1}`} height="500" image={card.image} />
            <CardContent
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: "rgb(190 190 190 / 16%)",
                color: 'rgb(61 61 61)',
                padding: '16px',
                textAlign: 'center',
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" style={{ fontWeight: 600, fontSize: '30px' }}>
                {card.label}
              </Typography>
              <Typography style={{ fontSize: '54px' }} variant="h4">
                {card.value}
              </Typography>
              <Typography style={{fontSize: '22px'}} variant="body2">
                {card.time}
                </Typography>
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '0',
                  right: '0',
                  textAlign: 'center',
                  color: 'rgb(255 255 255)',
                  fontSize: '12px',
                }}
              >
                This is a live capture from the device
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          width: '100%',
          textAlign: 'center',
        }}
      >
      <IconButton onClick={() => handleSwipe('right')}>
    <ArrowBack />
  </IconButton>
  <IconButton onClick={() => handleSwipe('left')}>
    <ArrowForward />
  </IconButton>
  <div style={{ fontSize: '12px', color: '#313131', marginTop: '8px' }}>
    &copy; {new Date().getFullYear} Team IT SMEC. All rights reserved.
  </div>
</div>
</div>
  );
};

export default IoTMonitoringSystem;
