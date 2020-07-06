import React, {useState, useEffect } from 'react'
import { View, Animated, Modal, Text, 
  Dimensions, TouchableOpacity, TextInput, StyleSheet,
  TouchableWithoutFeedback, Keyboard, Picker, Alert
} from 'react-native'
import { DatePicker } from '../../../components/index'
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons'; 

export default function EditModal({height, width, x, y, handleClose, handleEdit, handleDelete, lesson}) {
  const SCREEN_WIDTH = Dimensions.get('window').width
  const SCREEN_HEIGHT = Dimensions.get('window').height

  const [start, setStart] = useState(lesson.start)
  const [end, setEnd] = useState(lesson.end)
  const [name, setName] = useState(lesson.name)
  const [day, setDay] = useState(lesson.day)
  const [description, setDescription] = useState(lesson.description)

  const [editingStart, setEditingStart] = useState(false)
  const [editingEnd, setEditingEnd] = useState(false)

  const modalCoordinate = useState(new Animated.ValueXY({x: x, y: y}))[0]
  const modalHeight = useState(new Animated.Value(height))[0]
  const modalWidth = useState(new Animated.Value(width))[0]
  const whiteBoxFlex = useState(new Animated.Value(0))[0]

  const [edit, setEdit] = useState(false)

  const days = useState([
    {dayName: 'monday'},
    {dayName: 'tuesday'},
    {dayName: 'wednesday'},
    {dayName: 'thursday'},
    {dayName: 'friday'},
  ])[0]

  function toTwoDigitString(number) {
    return number < 10 ? '0' + number : '' + number
  }

  function toHourString(timeFromMidnight) {
    return toTwoDigitString(Math.floor(timeFromMidnight / 60))  + ':' 
    + toTwoDigitString(timeFromMidnight % 60)
  } 

  function makeTimeString(start, end, day) {
    const startHour = toHourString(start)
    const endHour = toHourString(end)
    const timeString = day.charAt(0).toUpperCase() + day.slice(1) + ', ' + startHour + ' - ' + endHour 
    // Day of week, hh:mm-hh:mm
    return timeString
  }

  function handleChangeStartTime(event, date) {
    setEditingStart(false)
    if (typeof date !== 'undefined') {
      var hour = date.getHours()
      var minute = date.getMinutes()
      setStart(hour * 60 + minute)
    }
  }

  function handleChangeEndTime(event, date) {
    setEditingEnd(false)
    if (typeof date !== 'undefined') {
      var hour = date.getHours()
      var minute = date.getMinutes()
      setEnd(hour * 60 + minute)
    }
  }

  useEffect(() => {
    const duration = 250
    const changeCoordinate = Animated.timing(modalCoordinate, {
      toValue: {
        x: SCREEN_WIDTH / 8,
        y: SCREEN_HEIGHT / 8,
      },
      duration: duration,
      useNativeDriver: false
    })
    const changeWidth = Animated.timing(modalWidth, {
      toValue: SCREEN_WIDTH / 4 * 3,
      duration: duration,
      useNativeDriver: false
    })
    const changeHeight = Animated.timing(modalHeight, {
      toValue: SCREEN_HEIGHT / 4 * 3,
      duration: duration,
      useNativeDriver: false
    })
    const changeWhiteBoxFlex = Animated.timing(whiteBoxFlex, {
      toValue: 4,
      duration: duration,
      useNativeDriver: false
    })
    Animated.parallel([
      changeCoordinate,
      changeWidth,
      changeHeight,  
      changeWhiteBoxFlex
    ]).start()
  }, [])

  function handlePenButtonClicked() {
    setDescription(lesson.description)
    setDay(lesson.day)
    setStart(lesson.start)
    setEnd(lesson.end)
    setName(lesson.name)
    setEdit(prevEdit => !prevEdit)
  }

  function handleSubmit() {
    if (name === '') {
      Alert.alert('Missing name', 'Class name cannot be empty', 
        [{text: 'ok'}]
      )
      return
    }

    if (end <= start) {
      Alert.alert('Invalid time interval', 'End time must be after start time',
        [{text: 'ok'}]
      )
      return 
    }

    var newLesson = {
      day: day,
      start: start,
      end: end,
      name: name,
      description: description,
    }
    handleEdit(newLesson, lesson.id)
    setEdit(false)
  }

  function handleDeleteClicked() {
    Alert.alert('Delete task', 'Are you sure you want to delete?', [
      {text: 'cancel', onPress:() => {}},
      {text: 'proceed', onPress:() => handleDelete(lesson.id)}
    ])
  }
  return (
    <Modal visible={true} transparent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Animated.View
            style={[{
              height: modalHeight,
              width: modalWidth,
              backgroundColor: '#51c9e7',
              borderRadius: 10,
              overflow: 'hidden'
            }, modalCoordinate.getLayout()]}
          >
            <View style={styles.insideBlueBox}>
              { !edit ? (
                <View>
                  <Text style={styles.duration}>
                    {makeTimeString(start, end, day)}
                  </Text>
                  <Text style={styles.name}>{name}</Text>
                </View>
                ) : (
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 4, height: 30}}>
                      <Picker
                        itemStyle={{}}
                        mode="dropdown"
                        style={styles.dayDropdown}
                        selectedValue={day}
                        onValueChange={value => setDay(value)}
                      >
                        {days.map((day, index) => (
                          <Picker.Item
                            color="black"
                            label={day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1,3)}
                            value={day.dayName}
                            index={index}
                            key={index}
                          />
                        ))}
                      </Picker>
                    </View>
                    <View style={styles.hourContainer}>
                      <TouchableOpacity onPress={() => setEditingStart(true)}>
                        <Text style={styles.duration}>{toHourString(start)}</Text>
                      </TouchableOpacity>
                      <Text style={styles.duration}> - </Text>
                      <TouchableOpacity onPress={() => setEditingEnd(true)}>
                        <Text style={styles.duration}>{toHourString(end)}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TextInput 
                    style={[styles.name, 
                      {borderBottomWidth: 1, borderColor: 'white'}
                    ]}
                    value={name}
                    onChangeText={text => setName(text)}
                    placeholder='Class name'
                    placeholderTextColor='#00000030'
                  />
                </View>
                )
              }
              
              <TouchableOpacity 
                onPress={handleClose} 
                style={styles.closeButton}
              >
                <AntDesign name="close" size={30} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <Animated.View 
              style={{
                flex: whiteBoxFlex, 
                backgroundColor: 'white',
                padding: 10,
              }}>
              {
                !edit 
                ? <Text style={styles.viewDescription}>{description}</Text> 
                : <View style={styles.editDescriptionBox} >
                  <TextInput
                    style={styles.editDescriptionInput}
                    underlineColorAndroid="transparent"
                    placeholder="Type the description of the class"
                    placeholderTextColor="#00000030"
                    numberOfLines={10}
                    multiline={true}
                    value={description}
                    onChangeText={text => setDescription(text)}
                  />
                </View>
              }
              {
                edit && 
                <TouchableOpacity 
                  style={styles.doneButton}
                  onPress={handleSubmit}
                >
                  <MaterialIcons name="done" size={24} color="white" />
                </TouchableOpacity>
              }
              {
                edit &&
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteClicked}
                >
                  <AntDesign name="delete" size={24} color="white" />
                </TouchableOpacity>
              }
              
              <TouchableOpacity
                style={styles.penButton}
                onPress={handlePenButtonClicked}
              >
                  <Feather name="edit-2" size={24} color='white'/>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
          <DatePicker 
            showDatePicker={editingStart} 
            value={new Date(2020, 1, 1, Math.floor(start / 60), start % 60)}  
            handleChange={handleChangeStartTime}
            mode='time'
          />
          <DatePicker 
            showDatePicker={editingEnd} 
            value={new Date(2020, 1, 1, Math.floor(end / 60), end % 60)}  
            handleChange={handleChangeEndTime}
            mode='time'
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#00000080'
  },
  insideBlueBox: {
    flex: 1, 
    paddingHorizontal: 10, 
    paddingTop: 23
  },
  duration: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'sourcesanspro-regular',
    fontSize: 20,
  },
  name: {
    color: 'white', 
    fontFamily: 'sourcesanspro-semibold',
    fontSize: 30
  },
  dayDropdown: {
    color: 'rgba(255,255,255,0.7)', 
    transform: [
      {scaleX: 16/14}, 
      {scaleY: 16/14}, 
      {translateX: 5}, 
      {translateY: -9}
    ],
    height: 50,
    width: 100
  },
  closeButton: {
    position: 'absolute', 
    right: 7, 
    top: 7, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  viewDescription: {
    fontFamily: 'sourcesanspro-regular',
    fontSize: 20, 
    padding: 6
  },
  editDescriptionBox: {
    borderColor: 'grey', 
    borderWidth: 1, 
    padding: 5, 
    height: 160
  },
  editDescriptionInput: {
    textAlignVertical: 'top', 
    height: 150, 
    fontFamily: 'sourcesanspro-regular',
    fontSize: 20,
  },
  doneButton: {
    position: 'absolute',
    bottom: 10,
    right: 70,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#2a9d8f',
    alignItems: 'center',
    justifyContent: 'center'
  },
  penButton: {
    position: 'absolute',
    bottom: 10,
    right: 10, 
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#51c9e7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 130,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#e76f51',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hourContainer: {
    flex: 6, 
    flexDirection: 'row',
    alignItems: 'center'
  }
})