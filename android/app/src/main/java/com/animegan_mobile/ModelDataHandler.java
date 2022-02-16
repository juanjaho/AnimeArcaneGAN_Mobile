package com.animegan_mobile;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import org.pytorch.IValue;
import org.pytorch.LiteModuleLoader;
import org.pytorch.MemoryFormat;
import org.pytorch.Module;
import org.pytorch.Tensor;
import org.pytorch.torchvision.TensorImageUtils;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import java.io.File;
import java.io.FileOutputStream;


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

    private float[] infer(String model, Bitmap bitmap, float[] mean, float[] std) throws IOException {
        Module module = LiteModuleLoader.load(assetFilePath(reactContext, model));
        Tensor inputTensor = TensorImageUtils.bitmapToFloat32Tensor(bitmap, mean, std, MemoryFormat.CONTIGUOUS);
        Tensor outputTensor = module.forward(IValue.from(inputTensor)).toTensor();
        return outputTensor.getDataAsFloatArray();

    }

    private String pyprocess(String imageUri, String model, Integer maxOutput) throws Exception {


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


        int constant = imageHeight * imageWidth;
        float[] mean;
        float[] std;
        if (model.equals("ArcaneGANv0.3.ptl")) {
            mean = TensorImageUtils.TORCHVISION_NORM_MEAN_RGB;
            std = TensorImageUtils.TORCHVISION_NORM_STD_RGB;
        } else {
            mean = new float[]{0.5f, 0.5f, 0.5f};
            std = new float[]{0.5f, 0.5f, 0.5f};
        }

        float[] dataArray = infer(model, bitmap, mean, std);


        int[] pixels = new int[imageHeight * imageWidth];
        for (int i = 0; i < constant; i++) {
            float r = (dataArray[i] * std[0] + mean[0]) * 255.0f;
            float g = (dataArray[i + constant] * std[1] + mean[1]) * 255.0f;
            float b = (dataArray[i + constant * 2] * std[2] + mean[2]) * 255.0f;
            pixels[i] = (((int) Math.max(Math.min(r, 255), 0)) << 16) | (((int) Math.max(Math.min(g, 255), 0)) << 8) | ((int) Math.max(Math.min(b, 255), 0));
        }


        bitmap = Bitmap.createBitmap(pixels, imageWidth, imageHeight, Bitmap.Config.RGB_565);

        try (FileOutputStream out = reactContext.openFileOutput("temp.jpeg", 0)) {
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out); // bmp is your Bitmap instance

            out.flush();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return reactContext.getFileStreamPath("temp.jpeg").toURI().toString();
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
