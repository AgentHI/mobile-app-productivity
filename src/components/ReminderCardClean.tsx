import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {AutoScaledFont} from '../config/Size';
import {Colors} from '../constants/Colors';
import {
  Bell,
  Clock,
  DotsThree,
  Pencil,
  UsersThree,
} from 'phosphor-react-native';
import {FormatDateToReadable, GetParsedTime} from '../config/Utils';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../fonts/routers/Routes';

interface ReminderCardCleanProps {
  item: any;
}

const ReminderCardClean = ({item}: ReminderCardCleanProps) => {
  // console.log('item__', item.title);
  const opacity = 0.9;
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: AutoScaledFont(0.5),
        flex: 1,
        borderColor: Colors.lighterGray,
        marginVertical: AutoScaledFont(8),
        borderRadius: AutoScaledFont(10),
      }}>
      <View style={styles.cardContainer}>
        {item.description ? (
          <View style={styles.cellStyle}>
            <Bell
              color={Colors.white}
              size={18}
              weight={'regular'}
              style={{opacity: opacity}}
            />
            <Text style={styles.userName}>{item.description}</Text>
          </View>
        ) : (
          <View style={styles.cellStyle}>
            <Bell
              color={Colors.white}
              size={18}
              weight={'regular'}
              style={{opacity: opacity}}
            />
            <Text style={styles.userName}>{item.title}</Text>
          </View>
        )}

        <View style={styles.cellStyle}>
          <Clock
            color={Colors.white}
            size={17}
            weight={'regular'}
            style={{opacity: opacity}}
          />
          <Text
            style={[
              styles.userName,
              {
                color: Colors.white,
                fontSize: AutoScaledFont(17),
                fontFamily: 'Poppins-Medium',
              },
            ]}>
            {FormatDateToReadable(item.trigger_time)}
          </Text>
        </View>

        <View style={styles.cellStyle}>
          <Clock
            color={Colors.primary}
            size={17}
            weight={'regular'}
            style={{opacity: opacity}}
          />
          <Text
            style={[
              styles.userName,
              {
                color: Colors.white,
                fontSize: AutoScaledFont(17),
                fontFamily: 'Poppins-Medium',
              },
            ]}>
            {GetParsedTime(item.trigger_time)}
          </Text>
        </View>

        <View style={styles.cellStyle}>
          <UsersThree
            color={Colors.primary}
            size={17}
            weight={'regular'}
            style={{opacity: opacity}}
          />
          <Text
            style={[
              styles.userName,
              {
                color: Colors.lightgray,
                fontSize: AutoScaledFont(15),
                fontFamily: 'Poppins-Medium',
              },
            ]}>
            {'Created at :'} {GetParsedTime(item.created_at)}{' '}
            {FormatDateToReadable(item.created_at)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.EditReminders, {item: item})}>
        <DotsThree
          color={Colors.white}
          size={25}
          weight={'bold'}
          style={{
            opacity: opacity,
            marginEnd: AutoScaledFont(20),
            marginTop: AutoScaledFont(20),
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(15),
    paddingVertical: AutoScaledFont(15),
    flex: 1,
  },
  row: {
    alignItems: 'center',
    paddingVertical: AutoScaledFont(12),
    margin: AutoScaledFont(15),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
  },
  cellStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: AutoScaledFont(5),
  },
  text: {
    marginLeft: AutoScaledFont(10),
    fontSize: AutoScaledFont(15),
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  userName: {
    fontSize: AutoScaledFont(18),
    marginStart: AutoScaledFont(12),
    color: Colors.white,
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
  },
  postedTime: {
    fontSize: AutoScaledFont(16),
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  userPic: {
    height: AutoScaledFont(80),
    width: AutoScaledFont(80),
    borderRadius: AutoScaledFont(40),
    marginTop: AutoScaledFont(10),
    borderColor: Colors.primaryBlue,
    alignSelf: 'center',
    backgroundColor: Colors.charcole,
  },
});

export default ReminderCardClean;