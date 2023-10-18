import React, { useState, useEffect } from 'react';
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
      image: '/images/temp1.png',
      background: 'rgb(190 190 190 / 52%)',
      label: 'Temperature',
      value: 'Fetching...',
    },
    {
      image: '/images/pre.jpg',
      background: 'rgb(96 96 96 / 32%)',
      label: 'Pressure',
      value: 'Fetching...',
    },
    {
      image: '/images/alt.jpg',
      background: 'rgb(96 96 96 / 32%)',
      label: 'Altitude',
      value: 'Fetching...',
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cardData.length);
    }, 2000); 

    return () => clearInterval(interval);
  }, [cardData]);

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

        setCardData((prevData) => [
          {
            ...prevData[0],
            value: temperatureData.last_value,
          },
          {
            ...prevData[1],
            value: pressureData.last_value,
          },
          {
            ...prevData[2],
            value: altitudeData.last_value,
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

    // Fetch data every 5 seconds
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

  return (
    <div>
      <CssBaseline />
      <AppBar style={{ background: 'aliceblue' }} position="sticky">
        <Toolbar>
          <img src="./images/smeclogo.png" alt="Logo" style={{ height: '19px', marginRight: '16px' }} />
          <Typography style={{ color: 'black', fontWeight: 550 }} variant="h6">
            IOT Monitoring System
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
                backgroundColor: card.background,
                color: 'rgb(61 61 61)',
                padding: '16px', 
                textAlign: 'center',
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" style={{ fontWeight: 600, fontSize: '30px' }}>
                {card.label}
              </Typography>
              <Typography style={{ fontSize: '76px' }} variant="h4">
                {card.value}
              </Typography>
              <Typography variant="body2">Time: 12:34 PM</Typography>
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
        <IconButton onClick={() => handleSwipe('left')}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={() => handleSwipe('right')}>
          <ArrowForward />
        </IconButton>
      </div>
    </div>
  );
};

export default IoTMonitoringSystem;
