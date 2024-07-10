import type { FC} from "react";
import React, { useCallback, useMemo, useState } from "react";
import type {
  Range,
  IconSource} from "@shopify/polaris";
import {
  DatePicker,
  Popover,
  TextField,
  Listbox,
  Icon
} from "@shopify/polaris";
import type {
  Calendar} from '~/api/helpers/date';
import {
  canConvertDate,
  formatDate,
  formatForCalendar, getTimeChoicesOnDay,
  partialUpdateDate,
  splitDateAsObject,
} from '~/api/helpers/date';

import { styles } from "./DateTimePicker.style";

/**
 * 年月日と時刻のセレクターの組み合わせ
 */
const DateTimePicker: FC<{
  label?: string;
  value?: string;
  onAcceptedCallback?: (value: string) => void;
}> = ({ label, value, onAcceptedCallback = (value: string) => {} }) => {
  const valueAsDate = useMemo(() => {
    if (value) {
      return new Date(value);
    }
    // 値が空の場合は、現在日付の0時0分0秒の値を返す
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  }, [value]);

  const onAcceptedDatePickerCallback = useCallback(
    (newDate: string) => {
      const { year, month, date } = splitDateAsObject(new Date(newDate));
      const result = partialUpdateDate(valueAsDate, { year, month, date });
      onAcceptedCallback(formatDate(result));
    },
    [valueAsDate, onAcceptedCallback]
  );

  const onAccpetedTimeSelecterCallback = useCallback(
    (newTime: string) => {
      const [hour, minute] = newTime.split(":").map((numAsStr) => {
        return parseInt(numAsStr);
      });
      const result = partialUpdateDate(valueAsDate, { hour, minute });
      onAcceptedCallback(formatDate(result));
    },
    [valueAsDate, onAcceptedCallback]
  );

  return (
    <ul css={styles.ul}>
      <li css={styles.li()}>
        <PopoverDatePicker
          label={label}
          value={value ?? ""}
          onAcceptedCallback={onAcceptedDatePickerCallback}
        />
      </li>
      <li css={styles.li(false)}>
        <PopoverTimeSelector
          label={label}
          value={value ?? ""}
          onAcceptedCallback={onAccpetedTimeSelecterCallback}
        />
      </li>
    </ul>
  );
};

/**
 * カレンダーポップオーバー付きの日付入力フィールド
 */
export const PopoverDatePicker: FC<{
  label?: string;
  value: string;
  onAcceptedCallback?: (value: string) => void;
}> = ({ label, value, onAcceptedCallback }) => {
  const valueAsDate = useMemo(() => {
    return value ? new Date(value) : new Date();
  }, [value]);

  const [displayedCalendar, setDisplayedCalendar] = useState<Calendar>(() => {
    const { year, month } = splitDateAsObject(valueAsDate);
    return { year, month: month - 1 };
  });

  const onChangeCalendar = useCallback((month: number, year: number) => {
    setDisplayedCalendar({
      year,
      month,
    });
  }, []);

  const validator = useCallback((value: string) => {
    if (value === "") return null;
    return canConvertDate(value) ? null : "年/月/日の形式で入力してください";
  }, []);

  const formatter = useCallback((value?: string | Range) => {
    if (typeof value === "string") {
      if (!canConvertDate(value)) {
        return value;
      }
      return formatForCalendar(new Date(value));
    }
    return formatForCalendar(value?.start);
  }, []);

  const { activator, active, incactivate, onChange } = usePopover<Range>(
    value,
    {
      label,
      icon: CalendarMajor,
      onAcceptedCallback: onAcceptedCallback,
      validator,
      formatter,
    }
  );

  return (
    <Popover
      active={active}
      activator={activator}
      onClose={incactivate}
      preferredAlignment="left"
      preferredPosition="above"
      autofocusTarget="none"
    >
      <div css={styles.popoverInner}>
        <DatePicker
          year={displayedCalendar.year}
          month={displayedCalendar.month}
          selected={valueAsDate}
          onChange={onChange}
          onMonthChange={onChangeCalendar}
        />
      </div>
    </Popover>
  );
};

const timeChoicesOnDay = getTimeChoicesOnDay();

/**
 * セレクターポップオーバー付きの時刻入力フィールド
 */
export const PopoverTimeSelector: FC<{
  label?: string;
  value: string;
  onAcceptedCallback?: (value: string) => void;
}> = ({ label, value, onAcceptedCallback }) => {
  const [choices, setChoices] = useState<string[]>(timeChoicesOnDay);

  const filterChoices = useCallback((value: string) => {
    const newChoices = !value
      ? timeChoicesOnDay
      : timeChoicesOnDay.filter((choice) => {
          return choice.indexOf(value) === 0;
        });
    setChoices(newChoices);
  }, []);

  const validator = useCallback((value: string) => {
    if (value === "") return null;
    return isTimeFormat(value) ? null : "時:分の形式で入力してください";
  }, []);

  const formatter = useCallback((value: string) => {
    if (!canConvertDate(value)) {
      return value;
    }
    return formatForTime(new Date(value));
  }, []);

  const { activator, active, incactivate, onChange } = usePopover<string>(
    value,
    {
      label,
      icon: ClockMajor,
      onChangeCallback: filterChoices,
      onAcceptedCallback,
      validator,
      formatter,
    }
  );

  const activeWithChoices = useMemo(() => {
    return active && choices.length !== 0;
  }, [active, choices]);

  return (
    <Popover
      active={activeWithChoices}
      activator={activator}
      onClose={incactivate}
      preferredAlignment="left"
      preferredPosition="above"
      autofocusTarget="none"
      preventFocusOnClose={true}
    >
      <div css={styles.popoverInner}>
        <Listbox onSelect={onChange}>
          {choices.map((choice) => (
            <Listbox.Option key={choice} value={choice}>
              {choice}
            </Listbox.Option>
          ))}
        </Listbox>
      </div>
    </Popover>
  );
};

type ArgOption<T> = {
  label?: string;
  icon?: IconSource;
  onChangeCallback?: (value: string) => void;
  onAcceptedCallback?: (value: string) => void;
  validator?: (value: string) => string | null;
  formatter?: (value: string | T) => string;
};

type Option<T> = {
  label: NonNullable<ArgOption<T>["label"]>;
  icon: NonNullable<ArgOption<T>["icon"]>;
  onChangeCallback: NonNullable<ArgOption<T>["onChangeCallback"]>;
  onAcceptedCallback: NonNullable<ArgOption<T>["onAcceptedCallback"]>;
  validator: NonNullable<ArgOption<T>["validator"]>;
  formatter: NonNullable<ArgOption<T>["formatter"]>;
};

const setOption = <T,>(option?: ArgOption<T>): Option<T> => {
  return {
    label: setFallbackValue<Option<T>["label"]>(option?.label, ""),
    icon: setFallbackValue<Option<T>["icon"]>(option?.icon, undefined),
    onChangeCallback: setFallbackValue<Option<T>["onChangeCallback"]>(
      option?.onChangeCallback,
      (value: string) => {}
    ),
    onAcceptedCallback: setFallbackValue<Option<T>["onAcceptedCallback"]>(
      option?.onAcceptedCallback,
      (value: string) => {}
    ),
    validator: setFallbackValue<Option<T>["validator"]>(
      option?.validator,
      (value: string) => null
    ),
    formatter: setFallbackValue<Option<T>["formatter"]>(
      option?.formatter,
      (value: string | T) => (typeof value === "string" ? value : "")
    ),
  };
};

const setFallbackValue = <T,>(value?: T, fallbackValue?: T) =>
  value ?? fallbackValue!;

/**
 * Popoverを利用するためのフック
 */
const usePopover = <T,>(value: string, option?: ArgOption<T>) => {
  // fallbacks
  const {
    label,
    icon,
    onChangeCallback,
    onAcceptedCallback,
    validator,
    formatter,
  } = setOption(option);

  const [activePopover, setActivePopover] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputFieldValue = useMemo(() => formatter(value), [value]);

  const validate = useCallback(
    (value: string): boolean => {
      const errorMessage = validator(value);
      if (!errorMessage) {
        setErrorMessage("");
        return true;
      }
      setErrorMessage(errorMessage);
      return false;
    },
    [validator]
  );

  const onChangeTextField = useCallback(
    (value?: string) => {
      const nonNullableValue = value ?? "";
      onChangeCallback(nonNullableValue);
      if (validate(nonNullableValue)) {
        onAcceptedCallback(formatter(nonNullableValue));
      }
    },
    [onChangeCallback, onAcceptedCallback, validate, formatter]
  );

  const activatePopover = useCallback(() => {
    setActivePopover(true);
  }, []);

  const inactivatePopover = useCallback(() => {
    setActivePopover(false);
  }, []);

  const onChangePopoverInnerField = useCallback(
    (result: T) => {
      setActivePopover(false);
      const formattedResult = formatter(result);
      onAcceptedCallback(formattedResult);
    },
    [onAcceptedCallback, formatter]
  );

  const popoverActivator = useMemo(
    () => (
      <TextField
        prefix={<Icon source={icon} />}
        label={label}
        inputMode="text"
        value={inputFieldValue}
        onChange={onChangeTextField}
        onFocus={activatePopover}
        error={errorMessage}
        autoComplete="off"
      />
    ),
    [label, inputFieldValue, errorMessage]
  );

  return {
    activator: popoverActivator,
    active: activePopover,
    activate: activatePopover,
    incactivate: inactivatePopover,
    onChange: onChangePopoverInnerField,
  };
};

export default DateTimePicker;
