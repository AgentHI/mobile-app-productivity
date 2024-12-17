import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AutoScaledFont} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import {debounce, get} from 'lodash';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BellSimpleRinging,
  Binoculars,
  CalendarCheck,
  CalendarPlus,
  CalendarX,
  Envelope,
  Microphone,
  Prohibit,
} from 'phosphor-react-native';
import {useSelector} from 'react-redux';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import LottieView from 'lottie-react-native';
import Voice from '@react-native-voice/voice';
import {GetIntent, HandleIntentApi} from '../../services/SmartAssistServices';
import {TOAST_} from '../../config/Utils';
import Tts from 'react-native-tts';

export const SmartAssist = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [searchNote, setsearchNote] = useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [record_, setRecord_] = React.useState<boolean>(false);
  const [preActions, setpreActions] = React.useState<any>([]);
  const [myNotesId, setMyNotesId] = React.useState<any>('');
  const token_ = useSelector(state => state.user.piData.token || {});
  const agentData = useSelector(state => state.user.agentData || {});

  const [text, settext] = React.useState<any>('');
  const [intentText, setintentText] = React.useState<any>('');
  const [isListening, setIsListening] = useState(false);
  const [hideAll, sethideAll] = useState(false);
  const animation = useRef(new Animated.Value(0))?.current;

  let opacity = 0.8;

  const actions = [
    {
      id: 1,
      text: 'Reschedule Meeting',
      icon: (
        <CalendarCheck
          size={22}
          color={Colors.black}
          style={{opacity: opacity}}
        />
      ),
    },
    {
      id: 2,
      text: 'Cancel Meeting',
      icon: (
        <CalendarX size={22} color={Colors.red} style={{opacity: opacity}} />
      ),
    },
    {
      id: 3,
      text: 'Send Email',
      icon: (
        <Envelope
          size={22}
          color={Colors.greenHex}
          style={{opacity: opacity}}
        />
      ),
    },
    {
      id: 4,
      text: 'Unavailable',
      icon: (
        <Prohibit size={22} color={Colors.red} style={{opacity: opacity}} />
      ),
    },
    {
      id: 5,
      text: 'Set Reminder',
      icon: (
        <BellSimpleRinging
          size={22}
          color={Colors.originalBlue}
          style={{opacity: opacity}}
        />
      ),
    },
    {
      id: 7,
      text: 'Schedule Meeting',
      icon: (
        <CalendarPlus
          size={22}
          color={Colors.behanceColor}
          style={{opacity: opacity}}
        />
      ),
    },
    {
      id: 6,
      text: 'Search',
      icon: (
        <Binoculars
          size={22}
          color={Colors.shiningBlue}
          style={{opacity: opacity}}
        />
      ),
    },
  ];

  const animatedValues = useRef(
    actions?.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    if (isFocused) {
      setRecord_(false);
      animatedValues.forEach(anim => anim.setValue(0));

      // Start animations
      Animated.stagger(
        100,
        animatedValues.map(anim =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ),
      ).start();
    }

    sethideAll(false);
    settext('');
    setintentText('');
  }, [isFocused, animatedValues]);

  React.useEffect(() => {
    setpreActions(actions);
    getUserData();
  }, []);

  useEffect(() => {
    if (text) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [text]);

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
  };

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
      // console.log('userData__', userData);

      return userData;
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  const updateTextSubmit = (text: string) => {
    setsearchNote(text);
  };


  const onPressItem = () => {
    TOAST_('Speak your command to the AI Agent by clicking the Mic below.', 'success',2500, 'center')
  };

  const searchNotes_ = async () => {
    if (!searchNote?.trim()) {
      return;
    }
    setLoading(true);
    Keyboard.dismiss();

    console.log('myNotesId__', myNotesId);

    let data = {
      smartNoteId: myNotesId,
      query: searchNote?.trim(),
    };

    try {
      // let result = await OverAllSearch_(data, token_);
      // console.log('result____', result);
      // setnotes(get(result, 'results', []));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchSearch = debounce(searchNotes_, 500);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    // stopListening();
    if (record_) {
      setintentText('');
    }
    record_ ? startListening() : stopListening();

    if (record_ && !hideAll) {
      console.log('sethideAll_____true');

      sethideAll(true);
    }
  }, [record_]);

  const onSpeechStart = () => {
    console.log('Speech started');
  };

  const onSpeechResults = event => {
    console.log('Speech results:', event?.value[0]);
    settext(event?.value[0]);

    GetIntentFromApi(event?.value[0]);
  };

  let GetIntentFromApi = async (intentText: string) => {
    setLoading(true);
    setintentText('Analzing Information...');
    speakText('Analzing Information');

    try {
      let result = await GetIntent(intentText, token_);
      if (get(result, 'data.intent', '')) {
        setintentText(
          prevText => `${prevText}\nIntent detected. Handling user Intent...`,
        );
        let result_ = await HandleIntentApi(
          get(agentData, 'agent._id', ''),
          get(result, 'data', {}),
          token_,
        );

        if (get(result_, 'message', '')) {
          TOAST_(get(result_, 'message', ''), 'success', 3000, 'center');
          setintentText(
            prevText => `${prevText}\n${get(result_, 'message', '')}`,
          );
          speakText(get(result_, 'message', ''));
        }
      } else {
        setintentText(
          'No intent detected. Please try again with different command',
        );
        speakText('No intent detected. Please try again with different command');

      }
    } catch (error) {
      setintentText('API failed please fix it');
    }
    setLoading(false);
  };

  const speakText = (text: string) => {
    try {
      Tts.speak(text);
    } catch (error) {}
  };

  const onSpeechPartialResults = event => {
    settext('');
    settext(event?.value);

    console.log('Partial Speech results:', event?.value);
    // settext(prevText => `${prevText} ${event?.value[event?.value.length - 1]}`);
  };

  const onSpeechEnd = async () => {
    console.log('Speech ended');
    setRecord_(false);
  };

  const onSpeechError = error => {
    console.log('Speech error:', error);
  };

  const startListening = async () => {
    try {
      console.log('Starting listening');
      settext('');
      setIsListening(true);
      await Voice.start('en-IN', {partialResults: true});
    } catch (error) {
      console.log('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      console.log('Stopping listening');
      setRecord_(false);
      await Voice.stop();
    } catch (error) {
      console.log('Error stopping voice recognition:', error);
    }
  };

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity onPress={()=>onPressItem()}>

      <Animated.View
        style={[
          styles.item,
          {
            opacity: animatedValues[index], // Fade-in effect
            transform: [
              {
                translateY: animatedValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0], // Slide-in effect
                }),
              },
            ],
          },
        ]}>
        <View style={styles.cardContainer}>
          {item?.icon}
          <Text style={styles.userName}>{item?.text}</Text>
        </View>
      </Animated.View>
      </TouchableOpacity>

    );
  };

  return (
    <Animated.View style={{backgroundColor: Colors.primary, flex: 1}}>
      {isFocused && (
        <AppStatusBar
          hidden={false}
          translucent={false}
          STYLES_={2}
          bgcolor={Colors.primary}
        />
      )}

      <TwoIconsHeader
        // leftTitle={Constants.SmartAssist}
        leftTitle={!hideAll ? 'Check how Smart Assist helps you' : ''}
        secondIcon={false}
        titleColor={Colors.white}
        onPress={() => navigation.goBack()}
        isDeviderShown={false}
        backHidden={true}
        deviderHeight={0.5}
      />

      <View
        style={{
          flex: 1,
          paddingBottom: AutoScaledFont(50),
        }}>
        <View
          style={{
            flex: 1,
          }}>
          {!hideAll && (
            <FlatList
              data={preActions}
              renderItem={renderItem}
              keyExtractor={item => get(item, 'id', '')}
              scrollEnabled={true}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              style={{
                alignContent: 'center',
                alignSelf: 'center',
              }}
            />
          )}

          {text && (
            <Animated.Text style={[styles.commandText, animatedStyle]}>
              {text}
            </Animated.Text>
          )}

          {intentText && (
            <Animated.Text style={[styles.intentTextS_]}>
              {intentText}
            </Animated.Text>
          )}

          {loading && (
            <ActivityIndicator
              size={'small'}
              color={Colors.white}
              style={{marginTop: AutoScaledFont(50)}}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={() => (!loading ? setRecord_(!record_) : {})}>
          <View
            style={{
              marginBottom: AutoScaledFont(10),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <LottieView
              style={[
                styles.referateAiAnimation,
                {height: AutoScaledFont(150), width: AutoScaledFont(150)},
              ]}
              source={require('../../animations/record_line.json')}
              autoPlay={true}
              loop={true}
              speed={record_ ? 1 : 0}
            />

            <Microphone
              size={32}
              color={Colors.white}
              style={{
                opacity: opacity,
                marginTop: -AutoScaledFont(20),
                marginBottom: AutoScaledFont(10),
              }}
            />
            <Text
              style={[
                styles.userName,
                {color: Colors.white, opacity: opacity, marginStart: 0},
              ]}>
              {record_ ? 'Recording...' : 'Press the icon to execute a command'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: AutoScaledFont(26),
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  item: {
    alignItems: 'center',
  },
  cardContainer: {
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(12),
    marginHorizontal: AutoScaledFont(5),
    marginTop: AutoScaledFont(10),
    borderRadius: AutoScaledFont(10),
    flexDirection: 'row',
    minWidth: AutoScaledFont(180),
    justifyContent: 'center',
    backgroundColor: Colors.whiteAlabaster,
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
  },
  referateAiAnimation: {
    alignSelf: 'center',
  },
  userName: {
    fontSize: AutoScaledFont(16),
    marginStart: AutoScaledFont(12),
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  commandText: {
    fontSize: AutoScaledFont(20),
    marginEnd: AutoScaledFont(20),
    marginStart: AutoScaledFont(50),
    color: Colors.white,
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
    borderWidth: AutoScaledFont(0.5),
    justifyContent: 'center',
    paddingHorizontal: AutoScaledFont(20),
    paddingVertical: AutoScaledFont(10),
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
    alignContent: 'center',
    borderRadius: AutoScaledFont(10),
    borderColor: Colors.lighterGray,
  },
  intentTextS_: {
    fontSize: AutoScaledFont(20),
    marginEnd: AutoScaledFont(50),
    marginStart: AutoScaledFont(20),
    marginTop: AutoScaledFont(50),
    color: Colors.darkGreenHex,
    borderWidth: AutoScaledFont(0.5),
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(15),
    backgroundColor: Colors.white,
    borderColor: Colors.lighterGray,
    borderRadius: AutoScaledFont(10),
    textAlign: 'left',
    fontFamily: 'Poppins-Medium',
  },
});
