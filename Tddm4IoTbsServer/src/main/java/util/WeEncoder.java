/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;
import static org.apache.commons.codec.binary.Base64.decodeBase64;
import static org.apache.commons.codec.binary.Base64.encodeBase64;
import org.apache.commons.codec.digest.DigestUtils;
import org.jasypt.util.text.BasicTextEncryptor;

/**
 *
 * @author CleanCode
 */
public class WeEncoder {

    private static final String staticKey = "SRXD";
    private SecureRandom aleatorio;

    public WeEncoder() {
        try {
            aleatorio = SecureRandom.getInstance("SHA1PRNG");
        } catch (Exception ex) {
            System.out.println("error en el Ramdon D:");
        }
    }

    private static final String[][] bufferLetters = new String[][]{
        {"zyC", "pLd", "aFo", "Jre", "Klc", "oMy", "qnP", "kfI", "iSz", "Gcu"},
        {"ZLo", "VmQ", "oLP", "RDg", "ZdP", "DcV", "oEG", "IuK", "AsM", "LOw"},
        {"AZM", "SFR", "OGH", "MVX", "YFD", "KTC", "DSK", "URF", "ACD", "HWX"},
        {"fme", "xia", "rtp", "acf", "cid", "oeb", "pwe", "zuw", "nvs", "amb"}
    };

    private static final String[][] minBufferLetters = new String[][]{
        {"b", "L", "o", "r", "l", "Y", "q", "P", "z", "G"},
        {"P", "V", "m", "Q", "c", "L", "X", "u", "A", "a"},
        {"t", "Y", "z", "P", "x", "w", "E", "T", "k", "o"},
        {"D", "f", "M", "I", "z", "d", "e", "p", "Q", "S"}
    };

    // Definición del tipo de algoritmo a utilizar (AES, DES, RSA)
    private final static String alg = "AES";
    // Definición del modo de cifrado a utilizar
    private final static String cI = "AES/CBC/PKCS5Padding";
    // Vector de inicialización
    private final static String iv = "0123456789ABCDEF";

    /**
     * Función de tipo String que recibe una llave (key), un vector de
     * inicialización (iv) y el texto que se desea cifrar
     *
     * @param key la llave en tipo String a utilizar
     * @param iv el vector de inicialización a utilizar
     * @param cleartext el texto sin cifrar a encriptar
     * @return el texto cifrado en modo String
     * @throws Exception puede devolver excepciones de los siguientes tipos:
     * NoSuchAlgorithmException, InvalidKeyException,
     * InvalidAlgorithmParameterException, IllegalBlockSizeException,
     * BadPaddingException, NoSuchPaddingException
     */
    public String textEncryptorAES(String key, String iv, String cleartext) throws Exception {
        Cipher cipher = Cipher.getInstance(cI);
        SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), alg);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(iv.getBytes());
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec, ivParameterSpec);
        byte[] encrypted = cipher.doFinal(cleartext.getBytes());
        return new String(encodeBase64(encrypted));
    }

    /**
     * Función de tipo String que recibe una llave (key), un vector de
     * inicialización (iv) y el texto que se desea descifrar
     *
     * @param key la llave en tipo String a utilizar
     * @param iv el vector de inicialización a utilizar
     * @param encrypted el texto cifrado en modo String
     * @return el texto desencriptado en modo String
     * @throws Exception puede devolver excepciones de los siguientes tipos:
     * NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException,
     * InvalidAlgorithmParameterException, IllegalBlockSizeException
     */
    public String textDecryptorAES(String key, String iv, String encrypted) throws Exception {
        Cipher cipher = Cipher.getInstance(cI);
        SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), alg);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(iv.getBytes());
        byte[] enc = decodeBase64(encrypted.getBytes());
        cipher.init(Cipher.DECRYPT_MODE, skeySpec, ivParameterSpec);
        byte[] decrypted = cipher.doFinal(enc);
        return new String(decrypted);
    }

    public String textDecryptorAES(String encrypted) {
        try {
            String key = "EasyIot-UML Diagram Tools - TDDM4IoTbs";
            Cipher cipher = Cipher.getInstance(cI);
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), alg);
            IvParameterSpec ivParameterSpec = new IvParameterSpec(iv.getBytes());
            byte[] enc = decodeBase64(encrypted);
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, ivParameterSpec);
            byte[] decrypted = cipher.doFinal(enc);
            return new String(decrypted);
        } catch (IllegalBlockSizeException | BadPaddingException | InvalidKeyException | InvalidAlgorithmParameterException | NoSuchAlgorithmException | NoSuchPaddingException ex) {
            Logger.getLogger(WeEncoder.class.getName()).log(Level.SEVERE, null, ex);
        }
        return "";
    }

    public String textEncryptorAES(String cleartext) throws Exception {
        String key = "92AE31A79FEEB2A3";
        Cipher cipher;
        cipher = Cipher.getInstance(cI);
        SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), alg);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(iv.getBytes());
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec, ivParameterSpec);
        byte[] encrypted = cipher.doFinal(cleartext.getBytes());
        return new String(encodeBase64(encrypted));

    }

    public String textEncryptor(String Cifrar) {
        String base64EncryptedString = "";
        try {
            //        String keyword = "BioForest2021";
//        BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
//        textEncryptor.setPassword(keyword);
//        String myEncryptedText = textEncryptor.encrypt(Cifrar);
//        System.out.println("Texto encriptado:\n" + myEncryptedText);
//        return myEncryptedText;

            String secretKey = "EasyIot-UML Diagram Tools - TDDM4IoTbs";
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digestOfPassword = md.digest(secretKey.getBytes("utf-8"));
            byte[] keyBytes = Arrays.copyOf(digestOfPassword, 24);

            SecretKey key = new SecretKeySpec(keyBytes, "DESede");
            Cipher cipher = Cipher.getInstance("DESede");
            cipher.init(Cipher.ENCRYPT_MODE, key);

            byte[] plainTextBytes = Cifrar.getBytes("utf-8");
            byte[] buf = cipher.doFinal(plainTextBytes);
            byte[] base64Bytes = Base64.encodeBase64(buf);
            base64EncryptedString = new String(base64Bytes);

        } catch (NoSuchAlgorithmException | UnsupportedEncodingException | NoSuchPaddingException | InvalidKeyException | IllegalBlockSizeException | BadPaddingException ex) {
            Logger.getLogger(WeEncoder.class.getName()).log(Level.SEVERE, null, ex);
        }
        return base64EncryptedString.replace("+", "MmM");
    }

    public String textDecryptor(String Decifrar) {
        String base64EncryptedString = "";
        try {
            //        String keyword = "BioForest2021";
//        BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
//        textEncryptor.setPassword(keyword);
//        String plainText = textEncryptor.decrypt(Decifrar);
//        System.out.println("Texto desencriptado:\n" + plainText);
//        return plainText;
            Decifrar = Decifrar.replace("MmM", "+");
            String secretKey = "EasyIot-UML Diagram Tools - TDDM4IoTbs";
            byte[] message = Base64.decodeBase64(Decifrar.getBytes("utf-8"));
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digestOfPassword = md.digest(secretKey.getBytes("utf-8"));
            byte[] keyBytes = Arrays.copyOf(digestOfPassword, 24);
            SecretKey key = new SecretKeySpec(keyBytes, "DESede");

            Cipher decipher = Cipher.getInstance("DESede");
            decipher.init(Cipher.DECRYPT_MODE, key);

            byte[] plainText = decipher.doFinal(message);

            base64EncryptedString = new String(plainText, "UTF-8");

        } catch (UnsupportedEncodingException | NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException | IllegalBlockSizeException | BadPaddingException ex) {
            Logger.getLogger(WeEncoder.class.getName()).log(Level.SEVERE, null, ex);
        }
        return base64EncryptedString;
    }

    public String textEncryptor(String Cifrar, String keyword) {
        BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
        textEncryptor.setPassword(keyword);
        String myEncryptedText = textEncryptor.encrypt(Cifrar);
        System.out.println("Texto encriptado:\n" + myEncryptedText);
        return myEncryptedText;
    }

    public String textDecryptor(String Decifrar, String keyword) {
        BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
        textEncryptor.setPassword(keyword);
        String plainText = textEncryptor.decrypt(Decifrar);
        System.out.println("Texto desencriptado:\n" + plainText);
        return plainText;
    }

    public static String cifradoCesar(String texto, int codigo) {
        StringBuilder cifrado = new StringBuilder();
        codigo = codigo % 26;
        for (int i = 0; i < texto.length(); i++) {
            if (texto.charAt(i) >= 'a' && texto.charAt(i) <= 'z') {
                if ((texto.charAt(i) + codigo) > 'z') {
                    cifrado.append((char) (texto.charAt(i) + codigo - 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) + codigo));
                }
            } else if (texto.charAt(i) >= 'A' && texto.charAt(i) <= 'Z') {
                if ((texto.charAt(i) + codigo) > 'Z') {
                    cifrado.append((char) (texto.charAt(i) + codigo - 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) + codigo));
                }
            }
        }
        return cifrado.toString();
    }

    //método para descifrar el texto
    public static String descifradoCesar(String texto, int codigo) {
        StringBuilder cifrado = new StringBuilder();
        codigo = codigo % 26;
        for (int i = 0; i < texto.length(); i++) {
            if (texto.charAt(i) >= 'a' && texto.charAt(i) <= 'z') {
                if ((texto.charAt(i) - codigo) < 'a') {
                    cifrado.append((char) (texto.charAt(i) - codigo + 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) - codigo));
                }
            } else if (texto.charAt(i) >= 'A' && texto.charAt(i) <= 'Z') {
                if ((texto.charAt(i) - codigo) < 'A') {
                    cifrado.append((char) (texto.charAt(i) - codigo + 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) - codigo));
                }
            }
        }
        return cifrado.toString();
    }

    public static String cifradoCesar(String texto) {
        String llave = "ellaeslallave";
        StringBuilder cifrado = new StringBuilder();
        int codigo = (getnum(llave)) % 26;
        for (int i = 0; i < texto.length(); i++) {
            if (texto.charAt(i) >= 'a' && texto.charAt(i) <= 'z') {
                if ((texto.charAt(i) + codigo) > 'z') {
                    cifrado.append((char) (texto.charAt(i) + codigo - 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) + codigo));
                }
            } else if (texto.charAt(i) >= 'A' && texto.charAt(i) <= 'Z') {
                if ((texto.charAt(i) + codigo) > 'Z') {
                    cifrado.append((char) (texto.charAt(i) + codigo - 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) + codigo));
                }
            }
        }
        return cifrado.toString();
    }

    //método para descifrar el texto
    public static String descifradoCesar(String texto) {
        String llave = "ellaeslallave";
        StringBuilder cifrado = new StringBuilder();
        int codigo = (getnum(llave)) % 26;
        for (int i = 0; i < texto.length(); i++) {
            if (texto.charAt(i) >= 'a' && texto.charAt(i) <= 'z') {
                if ((texto.charAt(i) - codigo) < 'a') {
                    cifrado.append((char) (texto.charAt(i) - codigo + 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) - codigo));
                }
            } else if (texto.charAt(i) >= 'A' && texto.charAt(i) <= 'Z') {
                if ((texto.charAt(i) - codigo) < 'A') {
                    cifrado.append((char) (texto.charAt(i) - codigo + 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) - codigo));
                }
            }
        }
        return cifrado.toString();
    }

    //método para cifrar el texto
    public static String cifradoCesar(String texto, String llave) {
        StringBuilder cifrado = new StringBuilder();
        int codigo = llave.length() % 26;
        for (int i = 0; i < texto.length(); i++) {
            if (texto.charAt(i) >= 'a' && texto.charAt(i) <= 'z') {
                if ((texto.charAt(i) + codigo) > 'z') {
                    cifrado.append((char) (texto.charAt(i) + codigo - 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) + codigo));
                }
            } else if (texto.charAt(i) >= 'A' && texto.charAt(i) <= 'Z') {
                if ((texto.charAt(i) + codigo) > 'Z') {
                    cifrado.append((char) (texto.charAt(i) + codigo - 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) + codigo));
                }
            }
        }
        return cifrado.toString();
    }

    //método para descifrar el texto
    public static String descifradoCesar(String texto, String llave) {
        StringBuilder cifrado = new StringBuilder();
        int codigo = llave.length() % 26;
        for (int i = 0; i < texto.length(); i++) {
            if (texto.charAt(i) >= 'a' && texto.charAt(i) <= 'z') {
                if ((texto.charAt(i) - codigo) < 'a') {
                    cifrado.append((char) (texto.charAt(i) - codigo + 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) - codigo));
                }
            } else if (texto.charAt(i) >= 'A' && texto.charAt(i) <= 'Z') {
                if ((texto.charAt(i) - codigo) < 'A') {
                    cifrado.append((char) (texto.charAt(i) - codigo + 26));
                } else {
                    cifrado.append((char) (texto.charAt(i) - codigo));
                }
            }
        }
        return cifrado.toString();
    }

    private int letterToInteger(String information) {
        int num = 0;
        for (int i = 0; i < information.length(); i++) {
            num += (int) information.charAt(i);
        }
        return num + 3;
    }

    public String encodeDJA(String texto) {
        if (isNumeric(texto)) {
            texto = getSuperID(texto);
            texto = transform(texto);
//            texto = cifradoCesar(texto, letterToInteger(staticKey));
            texto = cifradoCesar(texto, 12);
            byte[] bytesEncoded = Base64.encodeBase64(texto.getBytes());
            return new String(bytesEncoded);
        } else {
            return "";
        }
    }

    public String decodeDJA(String texto) {
        byte[] valueDecoded = Base64.decodeBase64(texto);
        texto = descifradoCesar(new String(valueDecoded), 12);
//        texto = descifradoCesar(texto, letterToInteger(staticKey));
        texto = untransform(texto);
        return texto;
    }

    public static String untransform(String formato) {
        String texto = "";
        for (int i = 0; i < formato.length() / 3; i++) {
            Boolean Rowflag = false;
            String part = formato.substring((i * 3), (i * 3) + 3);
            for (int bffRow = 0; bffRow < bufferLetters.length; bffRow++) {
                for (int bffCol = 0; bffCol < bufferLetters[0].length; bffCol++) {
                    if (part.equals(bufferLetters[bffRow][bffCol])) {
                        texto += bffCol;
                        Rowflag = true;
                    }
                }

            }
            if (Rowflag == false) {
                texto += "ñ";
            }
        }
        return texto;
    }

    public static String transform(String formato) {
        String texto = "";
        for (int i = 0; i < formato.length(); i++) {
            // y = i%%4;
            int y = i % 4;
            String caracter = String.valueOf(formato.charAt(i));
            int num = Integer.parseInt(caracter);
            texto += bufferLetters[y][num];
        }
        return texto;
    }

    private static boolean isNumeric(String cadena) {
        try {
            Integer.parseInt(cadena);
            return true;
        } catch (NumberFormatException nfe) {
            return false;
        }
    }

    public static String getSuperID(String num) {
        num = num.replaceAll("[^0-9]", "");
        String zeros = repeat("0", 15 - num.length());
        return zeros + num;
    }

    private static String repeat(String str, int times) {
        return new String(new char[times]).replace("\0", str);
    }

    public String getEmailCode() {
        String result = "";
        for (int i = 0; i < 10; i++) {
            int fila = aleatorio.nextInt(minBufferLetters.length);
            int col = aleatorio.nextInt(minBufferLetters[0].length);
            result += minBufferLetters[fila][col];
        }
        return cifradoCesar(result, letterToInteger(staticKey) + 2);
    }

    public String getMaxAlea() {
        String result = "";
        for (int i = 0; i < 12; i++) {
            int fila = aleatorio.nextInt(bufferLetters.length);
            int col = aleatorio.nextInt(bufferLetters[0].length);
            result += bufferLetters[fila][col];
        }
        return cifradoCesar(result, letterToInteger(staticKey) + 2);
    }
//    public String getEmailPass(String param1, String param2) {
//        String nam = "", allparam = param1 + param2;
//        for (int i = 0; i < 12; i++) {
//            nam += String.valueOf(allparam.charAt(aleatorio.nextInt(allparam.length())));
//        }
//        return getcodif(nam);
//    }
//

    public String getImgName(String text) {
        String txt = text.replaceAll("[^A-Za-z]", "");
        text = getSuperID(txt);
//        String result = "";
//        for (int i = 0; i < txt.length(); i++) {
//            int fila =aleatorio.nextInt(minBufferLetters.length);
//            int col =aleatorio.nextInt(minBufferLetters[0].length);
//            result += minBufferLetters[fila][col];
//        }
        return cifradoCesar(text, letterToInteger(staticKey) + 2);
    }

    public String encriptPassword(String pwd) {
        return DigestUtils.sha256Hex(pwd);
    }

    public static String encodeANGY(String texto) {
        //texto = transfor(texto);

        texto = cifradoCesar(texto);
        texto = cifradoCesar(texto, 619);
        byte[] bytesEncoded = Base64.encodeBase64(texto.getBytes());
        return new String(bytesEncoded);
    }

    public static String decodeANGY(String texto) {
        byte[] valueDecoded = Base64.decodeBase64(texto);
        texto = descifradoCesar(new String(valueDecoded), 619);
        texto = descifradoCesar(texto);
        //texto = des_transfor(texto);
        return texto;
    }

    public static String transfor(String formato) {
        String texto = "";
        for (int i = 0; i < formato.length(); i++) {
            switch (formato.charAt(i)) {
                case '0':
                    texto += "rZb";
                    break;
                case '1':
                    texto += "Eol";
                    break;
                case '2':
                    texto += "Skp";
                    break;
                case '3':
                    texto += "tjy";
                    break;
                case '4':
                    texto += "MAw";
                    break;
                case '5':
                    texto += "CNZ";
                    break;
                case '6':
                    texto += "PoO";
                    break;
                case '7':
                    texto += "Zai";
                    break;
                case '8':
                    texto += "YUo";
                    break;
                case '9':
                    texto += "ErT";
                    break;
                default:
                    break;
            }
        }
        return texto;
    }

    public static String des_transfor(String formato) {

        String texto = "";
        for (int i = 0; i < formato.length() / 3; i++) {
            switch (formato.substring((i * 3), (i * 3) + 3)) {
                case "rZb":
                    texto += "0";
                    break;
                case "Eol":
                    texto += "1";
                    break;
                case "Skp":
                    texto += "2";
                    break;
                case "tjy":
                    texto += "3";
                    break;
                case "MAw":
                    texto += "4";
                    break;
                case "CNZ":
                    texto += "5";
                    break;
                case "PoO":
                    texto += "6";
                    break;
                case "Zai":
                    texto += "7";
                    break;
                case "YUo":
                    texto += "8";
                    break;
                case "ErT":
                    texto += "9";
                    break;
                default:
                    System.out.println("ni vrg");
                    break;
            }
        }
        return texto;
    }

    private static int getnum(String dato) {
        int num = 0;
        for (int i = 0; i < dato.length(); i++) {
            num += (int) dato.charAt(i);
        }
        return num;
    }

    public String getUrlGeneric() {
        long tim = System.currentTimeMillis();
        String texto = transfor(String.valueOf(tim)) + getEmailCode();
        return texto;
    }
}
