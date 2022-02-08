import React from 'react';
import {InferenceSession, Tensor} from 'onnxruntime-react-native';
import {NativeModules} from 'react-native';
import {Buffer} from 'buffer';
const {ModelDataHandler} = NativeModules;

const inferImage = async (
  imageUri: string,
  outputWidth: Number,
  setImage: any,
) => {
  const options: InferenceSession.RunOptions = {};
  const modelPath = await ModelDataHandler.getLocalModelPath();
  const session: InferenceSession = await InferenceSession.create(modelPath);
  const byteInput = await ModelDataHandler.preprocess(imageUri, outputWidth);
  const input: {[name: string]: Tensor} = {};

  for (const key in byteInput) {
    if (Object.hasOwnProperty.call(byteInput, key)) {
      const buffer = Buffer.from(byteInput[key].data, 'base64');
      const tensorData = new Float32Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.length / Float32Array.BYTES_PER_ELEMENT,
      );

      input[key] = new Tensor(
        byteInput[key].type as keyof Tensor.DataTypeMap,
        tensorData,
        byteInput[key].dims,
      );
    }
  }
  const output: InferenceSession.ReturnType = await session.run(
    input,
    session.outputNames,
    options,
  );
  const mnistOutput: {[name: string]: {data: string}} = {};
  for (const key in output) {
    if (Object.hasOwnProperty.call(output, key)) {
      const buffer = (output[key].data as Float32Array).buffer;
      const tensorData = {
        data: Buffer.from(buffer, 0, buffer.byteLength).toString('base64'),
      };
      mnistOutput[key] = tensorData;
    }
  }
  mnistOutput['dims'] = {data: input.input.dims.slice(2, 4).toString()};

  const result = await ModelDataHandler.postprocess(mnistOutput);

  return setImage({
    path: result + '?' + Date.now(),
    width: input.input.dims[3],
    height: input.input.dims[2],
    fake: true,
  });
};
export default inferImage;
