# Mobile Implementation of AnimeGANv2


This project is a wrapper of the base model made by @TachibanaYoshino
[AnimeGANv2](https://github.com/TachibanaYoshino/AnimeGANv2) and the weighted face model by @bryandlee [
animegan2-pytorch](https://github.com/bryandlee/animegan2-pytorch) and Arcane model by @Alex Spirin [ArcaneGANv0.3](https://github.com/Sxela/ArcaneGAN/tree/v0.3).


This project differs from commercial applications such as [Prequel](https://www.prequel.app/) because the images are
processed locally/natively on the device itself rather than through a cloud server.

[Download the apk](https://github.com/juanjaho/animeGAN_Mobile/releases)

# Getting Started
Clone the project

    git clone https://github.com/juanjaho/animeGAN_Mobile

Create gradle.properties inside android folder at

    android/gradle.properties

Copy and paste the following into the gradle.properties:

    android.useAndroidX=true
    android.enableJetifier=true
    FLIPPER_VERSION=0.99.0
    MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
    MYAPP_UPLOAD_KEY_ALIAS=my-key-alias

Get the latest models from latest [release](https://github.com/juanjaho/animeGAN_Mobile/releases) and add wanted models to 
    
    android/app/src/main/assets

Enjoy :)
<br />

# Example

<table style="border: none; border-spacing: 0;">
    <tr>
        <td>
            <img src="testImage/girl1.jpg"
            alt="Elephant at sunset"
            width="230">
        </td>
        <td>
            <img src="testImage/girl1AnimeGAN.jpg"
            alt="Elephant at sunset"
            width="230">
        </td>
        <td>
            <img src="testImage/girl1Arcane.jpg"
            alt="Elephant at sunset"
            width="230">
        </td>
    </tr>
    <tr>
        <td>
            <img src="testImage/guy1.jpg"
            alt="Elephant at sunset"
            width="230">
        </td>
        <td>
            <img src="testImage/guy1AnimeGAN.jpg"
            alt="Elephant at sunset"
            width="230">
        </td>
        <td>
            <img src="testImage/guy1Arcane.jpg"
            alt="Elephant at sunset"
            width="230">
        </td>
    </tr>
    <tr>
        <td>
            Original
        </td>
        <td>
            AnimeGAN_Mobile
        </td>
        <td>
            Arcane
        </td>
    </tr>
</table>
  
