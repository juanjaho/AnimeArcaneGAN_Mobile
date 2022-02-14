package com.animegan_mobile;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.util.Base64;
import android.util.Log;
import android.util.SparseIntArray;
import android.widget.ImageView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;


import org.pytorch.IValue;
import org.pytorch.LiteModuleLoader;
import org.pytorch.MemoryFormat;
import org.pytorch.Module;
import org.pytorch.PyTorchAndroid;
import org.pytorch.Tensor;
import org.pytorch.torchvision.TensorImageUtils;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.IntBuffer;
import java.util.ArrayList;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Arrays;

import ai.onnxruntime.reactnative.TensorHelper;

public class ModelDataHandler extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    ModelDataHandler(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "ModelDataHandler";
    }

    @ReactMethod
    public void getLocalModelPath(String selectedModel, Promise promise) {
        try {
            String modelPath = copyFile(reactContext, selectedModel);
            promise.resolve(modelPath);
        } catch (Exception e) {
            promise.reject("Can't get a model", e);
        }

    }

    @ReactMethod
    public void preprocess(String uri, Integer maxOutput, Boolean faceModel, Promise promise) {
        try {
            WritableMap inputDataMap = preprocess(uri, maxOutput, faceModel);
            promise.resolve(inputDataMap);

        } catch (Exception e) {
            promise.reject("Can't process an image", e);
        }
    }

    @ReactMethod
    public void postprocess(ReadableMap result, Boolean faceModel, Promise promise) {
        try {
            String uri = postprocess(result, faceModel);
            promise.resolve(uri);
        } catch (Exception e) {
            promise.reject("Can't process a inference result", e);
        }
    }

    @ReactMethod
    public void pyprocess(String imageUri, String model, Integer maxOutput, Promise promise) throws Exception {
        try {
            String uri = pyprocess(imageUri, model, maxOutput);
            promise.resolve(uri);

        } catch (Exception e) {
            promise.reject("Can't process an image", e);
        }
    }

    private Bitmap getBitmap(String imageUri) throws Exception {
        InputStream is = MainApplication.getAppContext().getContentResolver().openInputStream(Uri.parse(imageUri));
        BufferedInputStream bis = new BufferedInputStream(is);
        byte[] imageArray = new byte[bis.available()];
        bis.read(imageArray);
        Bitmap bitmap = BitmapFactory.decodeByteArray(imageArray, 0, imageArray.length);
        return bitmap;
    }

    private String pyprocess(String imageUri, String model, Integer maxOutput) throws Exception {

//        Module module = LiteModuleLoader.load(modelUri);
//        bitmap = BitmapFactory.decodeStream(reactContext.getAssets().open("image.jpg"));
        Module module = LiteModuleLoader.load(assetFilePath(reactContext, model));


        Bitmap bitmap = getBitmap(imageUri);
        if (bitmap == null) {
            throw new Exception("Can't decode image: " + imageUri);
        }
        int imageHeight = bitmap.getHeight();
        int imageWidth = bitmap.getWidth();


        if (imageWidth >= imageHeight) {
            imageHeight = (int) ((maxOutput * 1.f / imageWidth) * imageHeight);
            if (imageHeight % 2 == 1) {
                imageHeight++;
            }
            imageWidth = maxOutput;
        } else {
            imageWidth = (int) ((maxOutput * 1.f / imageHeight) * imageWidth);
            if (imageWidth % 2 == 1) {
                imageWidth++;
            }
            imageHeight = maxOutput;
        }
        bitmap = Bitmap.createScaledBitmap(bitmap, imageWidth, imageHeight, false);

        Tensor inputTensor;
        int[] pixels;
        int constant = imageHeight * imageWidth;
        float[] dataArray;
        float[] mean;
        float[] std;
        if (model.equals("ArcaneGANv0.3.ptl")) {
            mean = TensorImageUtils.TORCHVISION_NORM_MEAN_RGB;
            std = TensorImageUtils.TORCHVISION_NORM_STD_RGB;
        } else {
            mean = new float[]{0.5f, 0.5f, 0.5f};
            std = new float[]{0.5f, 0.5f, 0.5f};
        }
        Log.d("step", "1");
        inputTensor = TensorImageUtils.bitmapToFloat32Tensor(bitmap, mean, std, MemoryFormat.CONTIGUOUS);
        Log.d("step", "2");
        IValue outputIValue = module.forward(IValue.from(inputTensor));
        inputTensor = null;
        Log.d("step", "4");
        Tensor outputTensor = outputIValue.toTensor();
        Log.d("step", "5");
        module = null;
        outputIValue = null;

        dataArray = outputTensor.getDataAsFloatArray();
        Log.d("step", "6");
        outputTensor = null;

        pixels = new int[imageHeight * imageWidth];
        for (int i = 0; i < constant; i++) {
            float r = (dataArray[i] * std[0] + mean[0]) * 255.0f;
            float g = (dataArray[i + constant] * std[1] + mean[1]) * 255.0f;
            float b = (dataArray[i + constant * 2] * std[2] + mean[2]) * 255.0f;
            pixels[i] = (((int) r) << 16) | (((int) g) << 8) | ((int) b);
        }
        Log.d("step", "4");
        dataArray = null;


        bitmap = Bitmap.createBitmap(pixels, imageWidth, imageHeight, Bitmap.Config.RGB_565);
        pixels = null;

        try (FileOutputStream out = reactContext.openFileOutput("temp.jpeg", 0)) {
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out); // bmp is your Bitmap instance

            out.flush();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return reactContext.getFileStreamPath("temp.jpeg").toURI().toString();
    }

    private WritableMap preprocess(String uri, Integer maxOutput, Boolean faceModel) throws Exception {
        final int batchSize = 1;

        InputStream is = MainApplication.getAppContext().getContentResolver().openInputStream(Uri.parse(uri));
        BufferedInputStream bis = new BufferedInputStream(is);
        byte[] imageArray = new byte[bis.available()];
        bis.read(imageArray);
        Bitmap bitmap = BitmapFactory.decodeByteArray(imageArray, 0, imageArray.length);
        if (bitmap == null) {
            throw new Exception("Can't decode image: " + uri);
        }
        int imageHeight = bitmap.getHeight();
        int imageWidth = bitmap.getWidth();


        if (imageWidth >= imageHeight) {
            imageHeight = (int) ((maxOutput * 1.f / imageWidth) * imageHeight);
            imageWidth = maxOutput;
        } else {
            imageWidth = (int) ((maxOutput * 1.f / imageHeight) * imageWidth);
            imageHeight = maxOutput;
        }
        bitmap = Bitmap.createScaledBitmap(bitmap, imageWidth, imageHeight, false);

        ByteBuffer imageByteBuffer = ByteBuffer.allocate(imageHeight * imageWidth * 4 * 3).order(ByteOrder.nativeOrder());
        FloatBuffer imageFloatBuffer = imageByteBuffer.asFloatBuffer();
        if (faceModel) {
            for (int h = 0; h < imageHeight; ++h) {
                for (int w = 0; w < imageWidth; ++w) {
                    int pixel = bitmap.getPixel(w, h);
                    imageFloatBuffer.put((float) Color.red(pixel) / 255 * 2 - 1);
                }
            }
            for (int h = 0; h < imageHeight; ++h) {
                for (int w = 0; w < imageWidth; ++w) {
                    int pixel = bitmap.getPixel(w, h);
                    imageFloatBuffer.put((float) Color.green(pixel) / 255 * 2 - 1);
                }
            }
            for (int h = 0; h < imageHeight; ++h) {
                for (int w = 0; w < imageWidth; ++w) {
                    int pixel = bitmap.getPixel(w, h);
                    imageFloatBuffer.put((float) Color.blue(pixel) / 255 * 2 - 1);
                }
            }
        } else {
            for (int h = 0; h < imageHeight; ++h) {
                for (int w = 0; w < imageWidth; ++w) {
                    int pixel = bitmap.getPixel(w, h);
                    imageFloatBuffer.put((float) Color.red(pixel) / 255 * 2 - 1);
                    imageFloatBuffer.put((float) Color.green(pixel) / 255 * 2 - 1);
                    imageFloatBuffer.put((float) Color.blue(pixel) / 255 * 2 - 1);
                }
            }

        }

        imageByteBuffer.rewind();

        WritableMap inputDataMap = Arguments.createMap();

        // dims
        WritableMap inputTensorMap = Arguments.createMap();

        WritableArray dims = Arguments.createArray();
        dims.pushInt(batchSize);
        if (faceModel) {
            dims.pushInt(3);
            dims.pushInt(imageHeight);
            dims.pushInt(imageWidth);
        } else {

            dims.pushInt(imageHeight);
            dims.pushInt(imageWidth);
            dims.pushInt(3);
        }


        inputTensorMap.putArray("dims", dims);

        // type
        inputTensorMap.putString("type", TensorHelper.JsTensorTypeFloat);

        // data encoded as Base64
        imageByteBuffer.rewind();
        String data = Base64.encodeToString(imageByteBuffer.array(), Base64.DEFAULT);
        inputTensorMap.putString("data", data);
        inputDataMap.putMap("input", inputTensorMap);


        return inputDataMap;
    }

    private String postprocess(ReadableMap result, Boolean faceModel) throws Exception {


        ReadableMap outputTensor = result.getMap("output");
        ReadableMap dims = result.getMap("dims");

        String outputData = outputTensor.getString("data");
        String[] dimens = dims.getString("data").split(",");

        int[] dimensions = new int[2];

        dimensions[0] = Integer.parseInt(dimens[1]);
        dimensions[1] = Integer.parseInt(dimens[0]);
        FloatBuffer buffer = ByteBuffer.wrap(Base64.decode(outputData, Base64.DEFAULT)).order(ByteOrder.nativeOrder()).asFloatBuffer();
        Bitmap bitmap;
        if (faceModel) {
            int[] pixels = new int[dimensions[0] * dimensions[1]];

            float[] dataArray = new float[dimensions[0] * dimensions[1] * 3];
            int count = 0;
            while (buffer.hasRemaining()) {
                dataArray[count] = buffer.get();
                count++;
            }

            int constant = dimensions[0] * dimensions[1];
            for (int i = 0; i < constant; i++) {
                float r = (dataArray[i] + 1) / 2 * 255.0f;
                float g = (dataArray[i + constant] + 1) / 2 * 255.0f;
                float b = (dataArray[i + constant * 2] + 1) / 2 * 255.0f;
                pixels[i] = (((int) r) << 16) | (((int) g) << 8) | ((int) b);
            }

            bitmap = Bitmap.createBitmap(pixels, dimensions[0], dimensions[1], Bitmap.Config.RGB_565);
        } else {
            bitmap = Bitmap.createBitmap(dimensions[0], dimensions[1], Bitmap.Config.ARGB_8888);
            bitmap.copyPixelsFromBuffer(buffer);
        }

        try (FileOutputStream out = reactContext.openFileOutput("temp.jpeg", 0)) {
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out); // bmp is your Bitmap instance

            out.flush();

        } catch (IOException e) {
            e.printStackTrace();
        }


        return reactContext.getFileStreamPath("temp.jpeg").toURI().toString();

    }


    private static String copyFile(Context context, String filename) throws Exception {
        File file = new File(context.getExternalFilesDir(null), filename);
        if (!file.exists()) {
            try (InputStream in = context.getAssets().open(filename)) {
                try (OutputStream out = new FileOutputStream(file)) {
                    byte[] buffer = new byte[1024];
                    int read = in.read(buffer);
                    while (read != -1) {
                        out.write(buffer, 0, read);
                        read = in.read(buffer);
                    }
                }
            }
        }

        return file.toURI().toString();
    }

    public static String assetFilePath(Context context, String assetName) throws IOException {
        File file = new File(context.getFilesDir(), assetName);
        if (file.exists() && file.length() > 0) {
            return file.getAbsolutePath();
        }

        try (InputStream is = context.getAssets().open(assetName)) {
            try (OutputStream os = new FileOutputStream(file)) {
                byte[] buffer = new byte[4 * 1024];
                int read;
                while ((read = is.read(buffer)) != -1) {
                    os.write(buffer, 0, read);
                }
                os.flush();
            }
            return file.getAbsolutePath();
        }
    }
}
