import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {AutoScaledFont} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import {useSelector} from 'react-redux';
import {PencilSimple, Trash, XCircle} from 'phosphor-react-native';

interface AiAssistModalProps {
  isVisible: boolean;
  onClosePress: () => void;
  userName?: string;
  item?: any;
  deleteNote?: () => void;
  editNotes?: () => void;
  onTextSubmit: (text: string, item: any) => void;
  deleteNoteSubmit: (item: any) => void;
}

const MyNotesModal = (props: AiAssistModalProps) => {
  let {
    isVisible = false,
    onClosePress,
    userName = '',
    item,
    deleteNote,
    editNotes,
    onTextSubmit,
    deleteNoteSubmit,
  } = props;
  const [deletePresses, setdeletePresses] = React.useState<boolean>(false);
  const [editable, seteditable] = React.useState<boolean>(false);

  const piData = useSelector((state: any) => state.piData || {});
  const [text, settext] = React.useState<string>(item?.text);
  const textInputRef = React.useRef(null);

  const handleSave = () => {
    if (onTextSubmit) {
      onTextSubmit(text, item);
    }
    onClosePress();
  };

  const deleteNote_ = () => {
    if (deleteNoteSubmit) {
      deleteNoteSubmit(item); 
    }
    onClosePress();
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.7}
      onBackdropPress={onClosePress}>
      <View
        style={{
          height: '75%',
          marginTop: 'auto',
          marginHorizontal: AutoScaledFont(-25),
          marginBottom: AutoScaledFont(-25),
          borderTopStartRadius: AutoScaledFont(20),
          borderTopEndRadius: AutoScaledFont(20),
          backgroundColor: Colors.whiteAlabaster,
        }}>
        <View
          style={{
            height: AutoScaledFont(4),
            backgroundColor: Colors.headerThreeColor,
            marginTop: AutoScaledFont(15),
            width: AutoScaledFont(80),
            alignSelf: 'center',
          }}></View>

        <ScrollView>
          <View
            style={{
              flex: 1,
              marginTop: AutoScaledFont(20),
              opacity: deletePresses ? 0.3 : 1,
            }}>
            {/* <NotesCardCentered item={item} editable={true} /> */}

            <TextInput
              style={styles.userName}
              ref={textInputRef}
              placeholderTextColor={Colors.gray}
              placeholder={'Start your note ...'}
              value={text}
              multiline={true}
              editable={true}
              onChangeText={settext}
            />
          </View>
        </ScrollView>

        <View
          style={{
            justifyContent: 'center',
          }}>
          <View
            style={{
              borderTopWidth: AutoScaledFont(0.5),
              borderColor: Colors.gray,
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                margin: AutoScaledFont(20),
                alignSelf: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                opacity: deletePresses ? 0.3 : 1,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setdeletePresses(true);
                }}>
                <Trash
                  color={Colors.red}
                  size={22}
                  weight={'regular'}
                  style={{opacity: 1}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // seteditable(true);
                  handleSave();
                }}>
                {/* <PencilSimple
                  color={Colors.black}
                  size={22}
                  weight={'regular'}
                  style={{opacity: 1, marginHorizontal: AutoScaledFont(120)}}
                /> */}

                <View
                  style={{
                    paddingHorizontal: AutoScaledFont(40),
                    paddingVertical: AutoScaledFont(10),
                    backgroundColor: 'green',
                    alignSelf: 'center',
                    marginHorizontal: AutoScaledFont(100),
                    borderRadius: AutoScaledFont(10),
                  }}>
                  <Text style={[styles.userName, {color: Colors.white}]}>
                    {'Save'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClosePress}>
                <XCircle
                  color={Colors.black}
                  size={22}
                  weight={'regular'}
                  style={{opacity: 1}}
                />
              </TouchableOpacity>
            </View>

            {deletePresses && (
              <View
                style={{
                  paddingHorizontal: AutoScaledFont(30),
                  paddingVertical: AutoScaledFont(15),
                  marginHorizontal: AutoScaledFont(15),
                  borderTopWidth: AutoScaledFont(0.5),
                  borderColor: Colors.gray,
                  borderRadius: AutoScaledFont(10),
                }}>
                <Text style={styles.userName}>
                  {'Are you sure want to delete this note?'}
                </Text>

                <View
                  style={{
                    paddingHorizontal: AutoScaledFont(30),
                    paddingVertical: AutoScaledFont(15),
                    marginHorizontal: AutoScaledFont(15),
                    alignSelf: 'center',
                    flexDirection: 'row',
                    borderRadius: AutoScaledFont(10),
                  }}>
                  <TouchableOpacity onPress={() => deleteNote_()}>
                    <View
                      style={{
                        paddingHorizontal: AutoScaledFont(40),
                        paddingVertical: AutoScaledFont(10),
                        backgroundColor: 'green',
                        marginHorizontal: AutoScaledFont(15),
                        alignSelf: 'center',
                        borderRadius: AutoScaledFont(10),
                      }}>
                      <Text style={[styles.userName, {color: Colors.white}]}>
                        {'Yes'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setdeletePresses(false);
                    }}>
                    <View
                      style={{
                        paddingHorizontal: AutoScaledFont(40),
                        paddingVertical: AutoScaledFont(10),
                        marginHorizontal: AutoScaledFont(15),
                        backgroundColor: 'red',
                        alignSelf: 'center',
                        borderRadius: AutoScaledFont(10),
                      }}>
                      <Text style={[styles.userName, {color: Colors.white}]}>
                        {'No'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MyNotesModal;

const styles = StyleSheet.create({
  container: {},
  xampusIdQr: {
    color: Colors.primaryBlue,
    fontFamily: 'Roboto-Regular',
    fontSize: AutoScaledFont(18),
    marginTop: AutoScaledFont(10),
  },
  changePicture: {
    color: Colors.primaryBlue,
    fontFamily: 'Poppins-medium',
    fontSize: AutoScaledFont(16),
    marginVertical: AutoScaledFont(10),
  },
  changePictureView: {
    marginVertical: AutoScaledFont(10),
    borderWidth: 0.5,
    borderColor: Colors.primaryBlue,
    borderRadius: AutoScaledFont(5),
  },
  userName: {
    fontSize: AutoScaledFont(18),
    marginHorizontal: AutoScaledFont(20),
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  headerTwo: {
    fontSize: AutoScaledFont(22),
    fontFamily: 'Poppins-Regular',
    color: Colors.black,
  },
  headerOne: {
    fontSize: AutoScaledFont(20),
    marginBottom: AutoScaledFont(10),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.shiningBlue,
  },

  closeIconView: {
    height: AutoScaledFont(40),
    width: AutoScaledFont(40),
    borderWidth: 0.5,
    marginTop: AutoScaledFont(10),
    borderColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: AutoScaledFont(20),
  },
  closeIcon: {
    height: AutoScaledFont(25),
    width: AutoScaledFont(25),
    tintColor: Colors.primaryBlue,
  },
  selectedStyle: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.aliceBlue,
    justifyContent: 'center',
    width: '100%',
    paddingVertical: AutoScaledFont(20),
    paddingHorizontal: AutoScaledFont(30),
  },
  title: {
    fontSize: AutoScaledFont(18),
    color: Colors.primaryBlue,
    fontFamily: 'Poppins-Medium',
  },
  selectionView: {
    borderRadius: AutoScaledFont(10),
    marginBottom: AutoScaledFont(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
