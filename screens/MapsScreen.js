import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import Modal from 'react-native-modal';

export default function MapsScreen({ route, navigation }) {
  const { userData } = route.params;
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 34.7071, // Limassol, Cyprus latitude
    longitude: 33.0226, // Limassol, Cyprus longitude
  });
  const [newPointName, setNewPointName] = useState('');
  const [isAddButtonEnabled, setAddButtonEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 34.7071,
    longitude: 33.0226,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchUserDataAndPoints = async () => {
      try {
        const userDataResponse = await axios.get(
          `https://managment-university-default-rtdb.europe-west1.firebasedatabase.app/users/${userData.uid}.json`
        );

        if (!userDataResponse.data) {
          const defaultUserData = {
            authenticated: 'pending',
            email: userData.email,
          };

          await axios.put(
            `https://managment-university-default-rtdb.europe-west1.firebasedatabase.app/users/${userData.uid}.json`,
            defaultUserData
          );
        }

        const pointsResponse = await axios.get(
          `https://managment-university-default-rtdb.europe-west1.firebasedatabase.app/users/${userData.uid}/pointsOfInterest.json`
        );

        const points = pointsResponse.data || [];
        setPointsOfInterest(Object.values(points));
      } catch (error) {
        console.error('Error fetching user data and points of interest:', error.message);
      }
    };

    fetchUserDataAndPoints();
  }, [userData.uid]);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const granted = await requestLocationPermission();

        if (granted) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation({
                latitude,
                longitude,
              });

              mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            },
            (error) => {
              console.error('Error getting current location:', error.message);
            }
          );
        }
      } catch (error) {
        console.error('Error setting initial location:', error.message);
      }
    };

    getLocation();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to provide a better experience.',
          }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else if (Platform.OS === 'ios') {
        // You can add iOS permissions handling here if needed
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      return false;
    }
  };

  const handleSearch = () => {
    const results = pointsOfInterest.filter((point) =>
      point.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (results.length > 0) {
      const result = results[0];
      setMapRegion({
        latitude: result.latitude,
        longitude: result.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }

    setSearchResults(results);
  };

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;

    try {
      setModalVisible(true);
      setCurrentLocation(coordinate);
    } catch (error) {
      console.error('Error handling map press:', error.message);
    }
  };

  const savePointOfInterest = async () => {
    try {
      const newPoint = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        name: newPointName,
      };

      setPointsOfInterest((prevPoints) => [...prevPoints, newPoint]);

      await axios.post(
        `https://managment-university-default-rtdb.europe-west1.firebasedatabase.app/users/${userData.uid}/pointsOfInterest.json`,
        newPoint
      );

      setModalVisible(false);
      setNewPointName('');
      disableAddButton();
    } catch (error) {
      console.error('Error saving point of interest:', error.message);
    }
  };

  const enableAddButton = () => {
    setAddButtonEnabled(true);
  };

  const disableAddButton = () => {
    setAddButtonEnabled(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        ref={mapRef}
        onPress={handleMapPress}
      >
        {searchTerm
          ? searchResults.map((point, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                title={point.name}
              />
            ))
          : pointsOfInterest.map((point, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                title={point.name}
              />
            ))}
      </MapView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.navigate('DashboardScreen', { email: userData.email, idToken: userData.idToken })
        }
      >
        <Text style={styles.backButtonText}>{'< Back to Dashboard'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Search saved spots..."
        value={searchTerm}
        onChangeText={(text) => {
          setSearchTerm(text);
          setSearchResults([]);
        }}
        onSubmitEditing={handleSearch}
      />

      {isAddButtonEnabled && (
        <View style={styles.addPointContainer}>
          <TextInput
            style={styles.addPointInput}
            placeholder="Spot name"
            value={newPointName}
            onChangeText={setNewPointName}
          />
          <TouchableOpacity style={styles.addPointButton} onPress={savePointOfInterest}>
            <Text style={styles.addPointButtonText}>Add Spot</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.modalInput}
            placeholder="Spot name"
            value={newPointName}
            onChangeText={setNewPointName}
          />
          <TouchableOpacity style={styles.modalButton} onPress={savePointOfInterest}>
            <Text style={styles.modalButtonText}>Save Spot</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchInput: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  addPointContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
  },
  addPointInput: {
    width: 150,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 10,
  },
  addPointButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  addPointButtonText: {
    color: '#fff',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalInput: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 200,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
  },
});
