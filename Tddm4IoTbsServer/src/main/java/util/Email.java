/*Clase de myEmail electronico 13/10/2019
    *LLamada...=>
    Email myEmail = new Email();
    myEmail.setContenidomyEmail("anthony.pachay2017@uteq.edu.ec", "Hola anthony", "Te cuento que estoy probando mi clase de myEmail electronico xd");
    List<String> location = new ArrayList<>();
    location.add("D:\\carpetaImg\\tuimg.jpg");
    myEmail.setArchivosAdjuntos(location);
    System.out.println(myEmail.sendmyEmail());
 */

// para envio de correos masivos separar los correos con un espacio, de nada anthony del futuro ;-)
package util;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

/**
 *
 * @author ANBREZ
 */
public class Email {

    private String myEmail = "";// mi usuario
    private String myPassword = ""; //mi myPassword
    Properties props = new Properties();

    //private List<String> location = new ArrayList<>();
    private Session session = null;
    private String asunto = "";
    private String detail = "";
    private String toPerson = "";
    
    private Address[] toPersons = new Address[0];

    public Email() {
        props.setProperty("mail.smtp.host", "smtp.gmail.com"); //1
        props.setProperty("mail.smtp.starttls.enable", "true");//2
        props.setProperty("mail.smtp.port", "587");//3
        props.setProperty("mail.smtp.auth", "true");
        session = Session.getDefaultInstance(props, null);
    }

    public Email(String mail_smtp_host, String mail_smtp_starttls_enable, String mail_smtp_port, String mail_smtp_auth) {
        props.setProperty("mail.smtp.host", mail_smtp_host);
        props.setProperty("mail.smtp.starttls.enable", mail_smtp_starttls_enable);
        props.setProperty("mail.smtp.port", mail_smtp_port);
        props.setProperty("mail.smtp.auth", mail_smtp_auth);
        session = Session.getDefaultInstance(props, null);
    }

    public void setmyEmailFrom(String email, String pass) {
        this.myEmail = email;
        this.myPassword = pass;
    }

    public void setContentEmail(String toPerson, String asunto, String detail) {
//        this.toPerson = toPerson;
        addPerson(toPerson);
        this.asunto = asunto;
        this.detail = detail;
    }

    /*public void setArchivosAdjuntos(List<String> location) {
        this.location = location;
    }*/
    public boolean addPerson(String perstr)
    {
        perstr = perstr.trim();
        String[] pers = perstr.split(" ");
        toPersons = new Address[pers.length];
        try {
            for (int index = 0; index < pers.length; index++) {
                toPersons[index] = (InternetAddress.parse(pers[index]))[0];
            }
            return true;
        } catch (AddressException ex) {
            return false;
        }
    }
    
    public boolean sendmyEmail() {
        try {
            MimeMultipart multiParte = new MimeMultipart();
            BodyPart texto = new MimeBodyPart();// detail de Email
//            texto.setText(detail);// envio por defecto
            texto.setContent(detail, "text/html");
            multiParte.addBodyPart(texto); // sobre el Email, el detail
            /*if (location != null) {
                for (int indice = 0; indice < location.size(); indice++) {
                    multiParte.addBodyPart(setArchivos(location.get(indice))); // sobre el Email, adjunto
                }
            }*/
            //-- Email
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(myEmail));
//            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toPerson));
            message.setRecipients(Message.RecipientType.TO, toPersons);
            message.setSubject(asunto);
            
            message.setContent(multiParte);
            message.saveChanges();

            Transport trans = session.getTransport("smtp");
            trans.connect(myEmail, myPassword);
            trans.sendMessage(message, message.getAllRecipients());
            trans.close();
            return true;
        } catch (Exception e) {
            System.out.println("EmailError:"+e.getMessage());
            return false;
        }
    }
    public boolean sendMultyEmail() {
        try {
            MimeMultipart multiParte = new MimeMultipart();
            BodyPart texto = new MimeBodyPart();// detail de Email
//            texto.setText(detail);// envio por defecto
            texto.setContent(detail, "text/html");
            multiParte.addBodyPart(texto); // sobre el Email, el detail
            /*if (location != null) {
                for (int indice = 0; indice < location.size(); indice++) {
                    multiParte.addBodyPart(setArchivos(location.get(indice))); // sobre el Email, adjunto
                }
            }*/
            //-- Email
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(myEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toPerson));
            message.setSubject(asunto);
            
            message.setContent(multiParte);
            message.saveChanges();

            Transport trans = session.getTransport("smtp");
            trans.connect(myEmail, myPassword);
            trans.sendMessage(message, message.getAllRecipients());
            trans.close();
            return true;
        } catch (Exception e) {
            System.out.println("EmailError:"+e.getMessage());
            return false;
        }
    }

    private BodyPart setFiles(String location) {
        BodyPart adjunto = new MimeBodyPart();
        File archivo = new File(location);
        if (archivo.exists()) {
            try {
                adjunto.setDataHandler(new DataHandler(new FileDataSource(location))); // archivo adjunto
                adjunto.setFileName(archivo.getName());
            } catch (MessagingException ex) {
                Logger.getLogger(Email.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return adjunto;
    }
}
