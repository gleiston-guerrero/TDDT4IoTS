/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package util;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.Charset;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributeView;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;

import static java.nio.file.StandardCopyOption.*;
import java.util.Arrays;

import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.apache.commons.io.FileUtils;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @author USUARIO
 */
public class FileAccess {

    public FileAccess() {
    }

    public String readFileText(String location, String flagformat) {
        File archivo = null;
        FileReader fr = null;
        BufferedReader br = null;
        String result = "";
        try {
            archivo = new File(location);
            if (archivo.exists()) {
                fr = new FileReader(archivo);
                br = new BufferedReader(fr);
                String linea;
                while ((linea = br.readLine()) != null) {
                    result += linea + (flagformat.equals("t") ? "\\n" : "");
                }
            } else {
                result = "{}";
                System.out.println("Archivo no existe");
            }
        } catch (Exception e) {
            result = "{}";
        } finally {
            try {
                if (null != fr) {
                    fr.close();
                }
                if (null != br) {
                    br.close();
                }
            } catch (Exception e2) {
                System.out.println("Error in readFileText.fr.close()");
            }
        }
        return result;
    }

    public boolean writeFileText(String location, String structure) {
        FileWriter fichero = null;
        PrintWriter pw = null;
        try {
            fichero = new FileWriter(location);
            pw = new PrintWriter(fichero);
            pw.println(structure);
        } catch (Exception e) {
            System.out.println("Error in save File project");
        } finally {
            try {
                if (null != fichero) {
                    fichero.close();
                }
                if (null != pw) {
                    pw.close();
                }
            } catch (Exception e2) {
                System.out.println("Error in writeFileText.fichero.close()");
            }
        }
        return true;
    }

    public boolean SaveImg(String base64, String rutaImagen) {
        File file = new File(rutaImagen);
        return writeOutputStream(base64, file);
    }

    private boolean writeOutputStream(String value, File outputStream) {
        String[] partes = value.split(",");
        try {
            byte[] imgBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(partes[1]);
            BufferedImage bufImg = ImageIO.read(new ByteArrayInputStream(imgBytes));
            ImageIO.write(bufImg, "png", outputStream);
            return true;
        } catch (Exception e) {
            System.out.println("Error creating image: " + e.getMessage());
            return false;
        }
    }

    public boolean saveFile(String base64, String fileurl) {
        String[] parts = base64.split(",");
        try {
            byte[] dataBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(parts[1]);
            FileOutputStream out = new FileOutputStream(fileurl);
            out.write(dataBytes);
            out.close();
            return true;
        } catch (Exception e) {
            System.out.println("Error creating image: " + e.getMessage());
            return false;
        }
    }

    public String getFileNames(String ruta, String folder, String root) {
        String files = "[";
        try {
            File carpeta = new File(ruta);
//            System.out.println("r:"+ruta+"\n"+carpeta.listFiles().length);
            for (File archivo : carpeta.listFiles()) {
                String extension = archivo.getName().substring(archivo.getName().lastIndexOf(".") + 1, archivo.getName().length());
                files += String.format("{\"name\":\"%s\",\"extension\":\"%s\",\"path\":\"%s\"},",
                        archivo.getName(), extension,
                        root + folder + archivo.getName());//folderDataCenter
            }
            if (!files.equals("[")) {
                files = files.substring(0, files.length() - 1) + "]";
            } else {
                files += "]";
            }
//            System.out.println(files);
            return files;
        } catch (Exception e) {
            return "[]";
        }
    }

    public String getFileInfo(String ruta) {
        String files = "[";
        try {
            File carpeta = new File(ruta);
//            System.out.println("r:"+ruta+"\n"+carpeta.listFiles().length);
            for (File archivo : carpeta.listFiles()) {
                String extension = archivo.getName().substring(archivo.getName().lastIndexOf(".") + 1, archivo.getName().length());
                String documento = readFileText(ruta + "/" + archivo.getName(), "t");
                byte[] bytesEncoded = Base64.encodeBase64(documento.getBytes());
                documento = new String(bytesEncoded);
                files += String.format("{\"name\":\"%s\",\"extension\":\"%s\",\"data\":\"%s\"},",
                        archivo.getName(), extension, documento);
            }
            if (!files.equals("[")) {
                files = files.substring(0, files.length() - 1) + "]";
            } else {
                files += "]";
            }
//            System.out.println(files);
            return files;
        } catch (Exception e) {
            return "[]";
        }
    }

    public String getFileList(String ruta) {
        String files = "[";
        try {
            File carpeta = new File(ruta);
            for (File archivo : carpeta.listFiles()) {
                if (archivo.isFile()) {
                    String extension = getExtension(archivo.getName());
                    String dates[] = getTimeInfoFiles(archivo);
                    files += String.format("{\"name\":\"%s\",\"extension\":\"%s\",\"creation\":\"%s\",\"upgrade\":\"%s\"},",
                            archivo.getName(), extension, dates[0], dates[1]);
                }
            }
            if (!files.equals("[")) {
                files = files.substring(0, files.length() - 1) + "]";
            } else {
                files += "]";
            }
            return files;
        } catch (Exception e) {
            return "[]";
        }
    }

    public boolean deleteFile(String fileurl) {
        boolean resp = false;
        try {
            File carpeta = new File(fileurl);
            if (carpeta.exists()) {
                resp = carpeta.delete();
            }
        } catch (Exception e) {
            System.out.println("deleteFile:" + e.getMessage());
        }
        return resp;
    }

    public boolean deleteDirectoryOrFile(File fil) {
        if (fil.exists()) {
            if (fil.isDirectory()) {
                try {
                    FileUtils.deleteDirectory(fil);
                    return true;
                } catch (IOException ex) {
                    System.out.println("warning deleteing Directoru :c");
                }
            } else {
                return fil.delete();
            }
        }
        return false;
    }

    public boolean makeZipFromFolder(String source, String target) {
        try {
            new ZipFile(target).addFolder(new File(source));
            return true;
        } catch (ZipException ex) {
            System.out.println("[Error zip]: xx" + ex.getMessage());
        }
        return false;
    }

    public boolean makeZipFromOneFile(String source, String target) {
        try {
            new ZipFile(target).addFile(source);
            return true;
        } catch (ZipException ex) {
            System.out.println("[Error zip OneFile]: " + ex.getMessage());
        }
        return false;
    }

    public boolean makeZipFromManyFile(String[] source, String target) {
        try {
            List<File> files = new ArrayList<>();
            for (String path : source) {
                files.add(new File(path));
            }
            new ZipFile(target).addFiles(files);
            return true;
        } catch (ZipException ex) {
            System.out.println("[Error zip ManyFile]: " + ex.getMessage());
        }
        return false;
    }

    public String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1, filename.length());
    }

    public String cleanFileName(String fileName) {
        return fileName.toLowerCase().replaceAll("[^a-zA-Z0-9]+", "");
    }

    public boolean move(File f1, File f2) {
        try {
            Files.move(f1.toPath(), f2.toPath(), StandardCopyOption.REPLACE_EXISTING);
            return true;
        } catch (IOException ex) {
            System.out.println("error move file:" + ex.getMessage());
            return false;
        }
    }

    public String lastUpdateFile(File fill) {
        long lastModified = fill.lastModified();

        String pattern = "yyyy-MM-dd hh:mm aa";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

        Date lastModifiedDate = new Date(lastModified);

        return simpleDateFormat.format(lastModifiedDate);
    }

    public String[] getTimeInfoFiles(File fil) {
        String[] response = {"0000-00-00 00:00 AM", "0000-00-00 00:00 AM"};
        try {
            Path path = Paths.get(fil.getPath());
            BasicFileAttributeView basicfile = Files.getFileAttributeView(path, BasicFileAttributeView.class, LinkOption.NOFOLLOW_LINKS);
            BasicFileAttributes attr = basicfile.readAttributes();

            response[0] = milliSecondsToDate(attr.creationTime().toMillis());
            response[1] = milliSecondsToDate(attr.lastModifiedTime().toMillis());
        } catch (Exception e) {
            System.out.println("getTimeInfoFilesError: " + e.getMessage());
        }
        return response;
    }

    private String milliSecondsToDate(long date) {
        String pattern = "yyyy-MM-dd hh:mm aa";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        Date lastModifiedDate = new Date(date);
        return simpleDateFormat.format(lastModifiedDate);
    }
    
    public void extracZip(String directorioZip) {
        System.out.println("DIRECTORIO ZIP " + directorioZip);
		//ruta donde están los archivos .zip
		File carpetaExtraer = new File(directorioZip);
		
		//valida si existe el directorio
		if (carpetaExtraer.exists()) {
			//lista los archivos que hay dentro  del directorio
			File[] ficheros = carpetaExtraer.listFiles();
			System.out.println("Número de ficheros encontrados: " + ficheros.length);
			
			//ciclo para recorrer todos los archivos .zip
			for (int i = 0; i < ficheros.length; i++) {
				System.out.println("Nombre del fichero: " + ficheros[i].getName());
				System.out.println("Descomprimiendo.....");
				try {
					//crea un buffer temporal para el archivo que se va descomprimir
					ZipInputStream zis = new ZipInputStream(new FileInputStream(directorioZip +"//"+ ficheros[i].getName()));
 
					ZipEntry salida;
					//recorre todo el buffer extrayendo uno a uno cada archivo.zip y creándolos de nuevo en su archivo original 
					while (null != (salida = zis.getNextEntry())) {
						System.out.println("Nombre del Archivo: "+salida.getName());	
							FileOutputStream fos = new FileOutputStream(directorioZip + salida.getName());
							int leer;
							byte[] buffer = new byte[1024];
							while (0 < (leer = zis.read(buffer))) {
								fos.write(buffer, 0, leer);
							}
							fos.close();
							zis.closeEntry();
					}
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				}catch(IOException e){
					e.printStackTrace();
				}
			}
			System.out.println("Directorio de salida: " + directorioZip);
		} else {
			System.out.println("No se encontró el directorio..");
		}
    }
    

    public boolean ValidateFolderExists(String path) {
        File parent = new File(path);
        if (!parent.exists()) {
            parent = new File(path);
            parent.mkdir();            
            return false;
        }
        else
            return true;
    }
    
    public boolean FolderExists(String path) {
        File parent = new File(path);
        if (!parent.exists())
            return false;
        else
            return true;
    }

    public String saveJsonEntregable(String[] data, String path,String nameTask) {
        JsonObject objJson = jsonObjectCreateNomenclature(data, path, true);

        FileAccess fac = new FileAccess();
        fac.writeFileText(path.concat(nameTask).concat(".json"), objJson.toString());
        return "Insertado correctamente";
    }

    public String upateJsonEntregable(String[] data, String path) {
        JsonObject objJson = jsonObjectCreateNomenclature(data, path, false);
        FileAccess fac = new FileAccess();

        fac.deleteFile(path);
        fac.writeFileText(path, objJson.toString());
        return "Actualizado correctamente";
    }

    public JsonObject jsonObjectCreateNomenclature(String[] data, String path, Boolean band) //actualizar y añadir informacion json
    {
        String jsoncad = "", vectorjson = "";
        
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");  
        LocalDateTime now = LocalDateTime.now();  
        String actualDate = (dtf.format(now));  
        
        if (data.length == 4 && band) {
            vectorjson = "[{'percentage':'" + data[0] + "','description':'" + data[1] + "','update_date':'" + actualDate + "'}]";
            jsoncad = "{'dataUpdate':" + vectorjson + ",'id_task':'" + data[2] + "'}";
            return Methods.stringToJSON(jsoncad);
        } else {
            
            
            JsonObject objJson = readFileJson(path);
            JsonElement elemento1 = objJson.get("dataUpdate");
            String obj = elemento1.toString().substring(1, elemento1.toString().length() - 1);
            String id = objJson.get("id_task").toString();
            
            
            vectorjson = "{'percentage':'" + data[0] + "','description':'" + data[1] + "','update_date':'" + actualDate + "'}";
            jsoncad = "{'dataUpdate': [" + obj + "," + vectorjson + "], 'id_task': " + id + "}";

            
            
            return Methods.stringToJSON(jsoncad);
        }
    }

    public JsonObject readFileJson(String path) {
        FileAccess fac = new FileAccess();
        String fileData = fac.readFileText(path, "f");
        JsonObject jsonObj = Methods.stringToJSON(fileData);
        return jsonObj;
    }

}
