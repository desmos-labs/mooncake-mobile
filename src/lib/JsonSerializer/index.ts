import { SerializedObject } from './types';
import Deserializers from './deserializers';
import Serializers from './serializers';

/**
 * Custom JSON serialization algorithm.
 */
function jsonReplacer(key: string, value: any): any {
  // Safe to ignore with ts-ignore since "this" is the object that we are currently
  // serializing.
  // @ts-ignore
  const toSerializeObject = this[key];
  if (toSerializeObject !== undefined) {
    const serializer = Serializers.find(e => e.canEncodeObj(toSerializeObject));
    return serializer ? JSON.stringify(serializer.encode(toSerializeObject)) : value;
  }
  return value;
}

/**
 * Custom JSON deserialization algorithm.
 */
const jsonReviver = (_key: string, value: any) => {
  if (value !== null && value !== undefined && value[0] === '{') {
    // We have a serialized object, try to deserialize it to see if it's one
    // of our custom serialized types.
    const deserializedObject = <Partial<SerializedObject>>JSON.parse(value);
    if (
      deserializedObject !== undefined &&
      deserializedObject.serializedType !== undefined &&
      deserializedObject.value !== undefined
    ) {
      const deserializer = Deserializers[deserializedObject.serializedType];
      if (deserializer) {
        return deserializer.decode(deserializedObject as SerializedObject);
      }
    }
  }
  return value;
};

/**
 * Function that serializes an object into a JSON string, using a custom serialization
 * algorithm that preserves the type of the object.
 * @param obj - The object to serialize.
 */
const serializeObject = (obj: any) => JSON.stringify(obj, jsonReplacer);

/**
 * Function that deserializes a JSON string into an object using a custom deserialization
 * algorithm that decodes the types of the object.
 * @param obj - The object to deserialize.
 */
const deserializeObject = (obj: any) => JSON.parse(obj, jsonReviver);

/**
 * A custom JSON serializer that supports serializing and deserializing objects
 * using a custom serialization algorithm that preserves the type of the object.
 * This can be used when storing data into the device storage.
 */
const MooncakeJsonSerializer = {
  serialize: serializeObject,
  deserialize: deserializeObject,
};

export default MooncakeJsonSerializer;
