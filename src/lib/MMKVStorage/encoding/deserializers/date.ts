import { Deserializer, SerializedObject } from '../types';

const DateDeserializer: Deserializer = {
  decode(serialized: SerializedObject): Date {
    return new Date(serialized.value);
  },
};

export default DateDeserializer;
