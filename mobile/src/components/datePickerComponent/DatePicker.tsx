import {useEffect, useState} from 'react';
import {TouchableOpacity, View, Platform} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {formatDate} from '../../utils/dateFormat';
import styles from './styles';
import CustomText from '../textComponent/CustomText';
import THEME from '../../assets/themes/THEME';

interface DatePickerProps {
  onChange?: (date: Date) => void;
  label: string;
  initialDate?: Date | string | null;
  isError?: boolean;
}

export default function DatePicker({
  onChange,
  label,
  initialDate = null,
  isError = false,
}: DatePickerProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState(false);

  // Update the date when the initialDate prop changes
  useEffect(() => {
    const getInitialDate = () => {
      if (!initialDate) {
        return new Date();
      }

      if (typeof initialDate === 'string') {
        return new Date(initialDate);
      }

      return initialDate;
    };

    if (initialDate) {
      setDate(getInitialDate());
    }
  }, [initialDate]);

  formatDate(date.toISOString());

  function handleDateChange(
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) {
    if (selectedDate) {
      const updatedDate = new Date(selectedDate);

      if (mode === 'date') {
        updatedDate.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        );
      } else {
        updatedDate.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
        );
      }
      setDate(updatedDate);

      if (mode === 'date') {
        setMode('time');
        setShow(true);
      } else {
        setShow(false);
        onChange && onChange(updatedDate);
      }
    }
  }

  function showPicker(pickerMode: 'date' | 'time') {
    setShow(true);
    setMode(pickerMode);
  }

  return (
    <>
      {show && (
        <DateTimePicker
          value={date}
          locale="pt-BR"
          mode={mode}
          is24Hour={true}
          minimumDate={new Date()}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}
      <View>
        <CustomText
          style={[styles.label, isError && {color: THEME.COLORS.red}]}>
          {label}
        </CustomText>
        <TouchableOpacity
          onPress={() => showPicker('date')}
          style={[styles.input, isError && {borderColor: THEME.COLORS.red}]}>
          <View>
            <CustomText style={styles.text}>
              {formatDate(date.toISOString())}
            </CustomText>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
