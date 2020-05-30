import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TodoItemStyles } from '../../style/TodoItemStyles.js'

export default function TodoItem({ item }) {
    var dateString = item.date.getDate() + '/' + item.date.getMonth() + '/' + (item.date.getYear() + 1900)

    return (
        <View style={TodoItemStyles.task}>
            <View>
                <Text style={TodoItemStyles.text}>{item.task}</Text>
                <Text style={TodoItemStyles.text}>{dateString}</Text>
            </View>
            <View style={TodoItemStyles.rightColumn}>
                <Text style={[TodoItemStyles.text, {marginRight: 10}]}>More</Text>
                <Ionicons name='ios-arrow-forward' size={18}/>
            </View>
        </View>
    )
}