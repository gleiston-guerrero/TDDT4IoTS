/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Controller;

import DAO.Component_TaskDAO;
import DAO.ReportDao;
import com.google.gson.JsonObject;
import com.lowagie.text.BadElementException;

import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.HeaderFooter;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.imageio.ImageIO;
import javax.swing.table.DefaultTableModel;
import util.FileAccess;

/**
 *
 * @author HECTOR CASANOVA
 */
public class ReportesCtrl {

    private String rutaAbs;
    private DefaultTableModel data;
    private String titulodoc;
    private float[] ancho;

    //consulta
    private String[] consultas;

    private ReportDao reportDao; //DAO
    static final Integer registrosPag = 60;
    private Integer auxConta;
    private Integer numeroPag;
    private Boolean tipo;
    private String rutaEnc;
    private float[] anchoH;
    private String project;

    public ReportesCtrl(DefaultTableModel data, String titulo, String ruta,String rutaEnc,String project) {
        this.data = data;
        titulodoc = titulo;
        rutaAbs = ruta;
        ancho = new float[data.getColumnCount()];
        auxConta = 0;
        numeroPag = 1;
        tipo = true; //reportes por una tabla
        this.rutaEnc=rutaEnc;
        this.project=project;
    }

    public ReportesCtrl(String[] consultas, String titulo, String ruta,String rutaEnc) {
        reportDao = new ReportDao();
        this.consultas = consultas;
        titulodoc=titulo;
        rutaAbs = ruta;
        numeroPag = 1;
        tipo = false;  //reporte por todas las tablas
        this.rutaEnc=rutaEnc;
        this.project="";
    }

   private void CabeceraPdf(PdfPTable pdftable, DefaultTableModel data) {
        PdfPCell celda = new PdfPCell();
        celda.setBackgroundColor(new Color(2, 104, 2));
        celda.setPadding(5);

        Font fuente = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fuente.setColor(Color.WHITE);

        for (int x =0; x < data.getColumnCount(); x++) {
            String inicial=data.getColumnName(x).substring(0,1);
            celda.setPhrase(new Phrase(inicial.toUpperCase()+""+data.getColumnName(x).substring(1,data.getColumnName(x).length()), fuente));
            pdftable.addCell(celda);
        }
    }

//    private void DefinirEncabezado(Document documento) throws BadElementException, IOException {
//        Image image = Image.getInstance("C:\\Users\\USUARIO\\Desktop\\archivo\\encabezado.jpeg");
//        image.setAlignment(Image.MIDDLE);
//        image.scaleAbsoluteHeight(200f);
//        image.scaleAbsoluteWidth(200f);
//        image.scalePercent(100);
//        Chunk chunk = new Chunk(image, 0, 0);
//        chunk.setBackground(new Color(0, 0, 0, 0));
//        HeaderFooter header = new HeaderFooter(new Phrase(chunk), false);
//        header.setAlignment(Element.ALIGN_CENTER);
//        header.setTop(100f);
//        documento.setHeader(header);
//    }

    private void EscribirContenidoTabla(DefaultTableModel data, Document documento) throws BadElementException, IOException {
        PdfPTable pdftable = new PdfPTable(data.getColumnCount());
        CabeceraPdf(pdftable, data);
        Boolean bandera = true;
        ancho = new float[data.getColumnCount()];
        for (int x = 0; x < data.getRowCount(); x++) {
            auxConta++;
            for (int i = 0; i < data.getColumnCount(); i++) {

                pdftable.addCell(data.getValueAt(x, i).toString());
                if (bandera) {
                    ancho[i] = 2.3f;
                }
            }

            auxConta++;
            if (auxConta >= registrosPag) {
                auxConta = 0;
                DimencionesTabla(pdftable);
                documento.add(pdftable);
                System.out.println(documento.getPageSize().getHeight());
                documento.newPage();
                pdftable = new PdfPTable(data.getColumnCount());
                CabeceraPdf(pdftable, data);
            }

            bandera = false;
        }

        if (auxConta > 0) {
            DimencionesTabla(pdftable);
            documento.add(pdftable);
        }
    }

    private void DimencionesTabla(PdfPTable pdftable) {
        pdftable.setSpacingBefore(45);
        pdftable.setWidths(ancho);
        pdftable.setWidthPercentage(100);
    }

    public void ExportarPDF() throws FileNotFoundException, BadElementException, IOException {

        Document documento = new Document(PageSize.A3);
        documento.setMargins(15f, 15f, 220f, 100f);

        PdfWriter.getInstance(documento, new FileOutputStream(rutaAbs + "\\documento.pdf"));
        NumeroPaguina(documento);  //header
        DefinirEncabezado(documento); //footer 
        documento.open();

        Font fuente = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fuente.setColor(Color.BLACK);
        fuente.setSize(15);

        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        Date date = new Date();
        String fechaActual = formatter.format(date);

        Paragraph tfecha = new Paragraph("Report date: " + fechaActual, fuente);
        tfecha.setSpacingBefore(15);
        documento.add(tfecha);

        if(project.equals("")){
            if(tipo)
                EscribirContenidoTabla(data, documento);
            else
               EscribirDatos(documento); 
        }else
            imprimirTarea(data,documento);
        
        documento.close();
    }

//    private void InsertarImagen(Document docu) throws BadElementException, IOException
//    {
//        Image image = Image.getInstance("C:\\Users\\USUARIO\\Desktop\\archivo\\imagen.jpg");
//        image.scaleAbsolute(90f, 70f);
//        image.setAbsolutePosition(30, 1100);
//        docu.add(image);
//    }
//     
//    public void ExportarPDF2() throws FileNotFoundException, BadElementException, IOException {
//        Document documento = new Document(PageSize.A3);
//        documento.setMargins(15f, 15f, 260f, 100f);
//        PdfWriter.getInstance(documento,
//                new FileOutputStream(rutaAbs + "\\documento.pdf"));
//        NumeroPaguina(documento);
//        documento.open();
//
//        AsignarTitulo(documento, titulos[0], true, 30);
//
//        Font fuente = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
//        fuente.setColor(Color.BLACK);
//        fuente.setSize(10);
//
//        //fecha
//        SimpleDateFormat formatter = new SimpleDateFormat(" dd/MM/yyyy HH:mm:ss");
//        Date date = new Date();
//        String fechaActual = formatter.format(date);
//
//        Paragraph tfecha = new Paragraph("Fecha de Reporte: " + fechaActual, fuente);
//        tfecha.setSpacingBefore(15);
//        documento.add(tfecha);
//
//        EscribirDatos(documento);  //añade las tablas al documento
//        documento.close();
//    }

    private void EscribirDatos(Document documento) throws BadElementException, IOException {
        String ideEntregable = "";
        PdfPTable tablepdf;
        DefaultTableModel[] tabla = new DefaultTableModel[3];
        tabla[0] = reportDao.queryReport(consultas[0]); //consulta1
        for (int x = 0; x < tabla[0].getRowCount(); x++) {
            if (tabla[0].getRowCount() != 0) {
                AsignarTitulo(documento, "Deliverables", false, 15);
                ideEntregable = tabla[0].getValueAt(x, 0).toString();
                //primera tabla
                tablepdf = new PdfPTable(tabla[0].getColumnCount());  //tabla1 dimensiones
                crearTablayEspaciado(tablepdf, documento, 45f, 20f, tabla[0], false, x);  //datos por entregables
                //********************//
            }
            tabla[1] = reportDao.queryReport(consultas[1] + ideEntregable);  //consulta1
            for (int i = 0; i < tabla[1].getRowCount(); i++) {
                if (tabla[1].getRowCount() != 0) {
                    AsignarTitulo(documento, "Components", false, 15);
                    tablepdf = new PdfPTable(tabla[1].getColumnCount());  //tabla2 dimensiones
                    crearTablayEspaciado(tablepdf, documento, 20f, 20f, tabla[1], false, i);  //datos por componentes
                    System.out.println("aeiou");
                }

                tabla[2] = reportDao.queryReport(consultas[2] + tabla[1].getValueAt(i, 0).toString());  // consulta3
                if (tabla[2].getRowCount() != 0) {
                    AsignarTitulo(documento, "Tasks", false, 15);
                    tablepdf = new PdfPTable(tabla[2].getColumnCount());  //tabla2 dimensiones
                    crearTablayEspaciado(tablepdf, documento, 20f, 20f, tabla[2], true, null);
                    //datos por tareas
                }
            }
        }
    }

    private void crearTablayEspaciado(PdfPTable tablepdf, Document documento,
            float espacioAntes, float espacioDespues, DefaultTableModel tabladata, Boolean tipoImpresion, Integer fila) throws BadElementException, IOException {
        CabeceraPdf(tablepdf,tabladata);
        if (tipoImpresion) {
            EscribirContenidoTabla1(tablepdf, tabladata);
        } else {
            EscribirContenidoTablaPorFila(tablepdf, tabladata, fila);
        }
        //espacio entre tablas
        tablepdf.setSpacingBefore(espacioAntes);
        tablepdf.setSpacingAfter(espacioDespues);
        tablepdf.setWidths(ancho);     //defecto
        tablepdf.setWidthPercentage(100);  //defecto 
        //añadir la tabla en el documento
        documento.add(tablepdf);
        //documento.newPage();
        
    }

    private void EscribirContenidoTablaPorFila(PdfPTable pdftable, DefaultTableModel data, Integer fila) {
        ancho = new float[data.getColumnCount()];
        for (int i = 0; i < data.getColumnCount(); i++) {
            pdftable.addCell(data.getValueAt(fila, i).toString());
            ancho[i] = 2.3f;
        }
    }

    private void AsignarTitulo(Document documento, String title, Boolean bandera, Integer tamañoTitulo) {
        Font fuenteN = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fuenteN.setColor(Color.BLACK);
        fuenteN.setSize(tamañoTitulo);

        Paragraph titulo = new Paragraph(title, fuenteN);
        titulo.setAlignment(bandera ? Paragraph.ALIGN_CENTER : Paragraph.ALIGN_LEFT);
        documento.add(titulo);
    }

    private void NumeroPaguina(Document documento) {
        Font fuenteN = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fuenteN.setColor(Color.BLACK);
        fuenteN.setSize(10);
        HeaderFooter footer = new HeaderFooter(true);
        footer.disableBorderSide(Rectangle.OUT_BOTTOM);
        footer.setAlignment(Rectangle.OUT_LEFT);
        documento.setFooter(footer);
    }

    private void EscribirContenidoTabla1(PdfPTable pdftable, DefaultTableModel data) {
        Boolean bandera = true;
        ancho = new float[data.getColumnCount()];
        for (int x = 0; x < data.getRowCount(); x++) {
            for (int i = 0; i < data.getColumnCount(); i++) {
                pdftable.addCell(data.getValueAt(x, i).toString());
                if (bandera) {
                    ancho[i] = 2.3f;
                }
            }
            bandera = false;

        }
    }
//
//    private void textoimagen(Document documento) throws MalformedURLException, IOException {
//        Image image;
//
//        BufferedImage imagek = ImageIO.read(new URL(
//                "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg"));
//
//        java.awt.Font font;
//        font = new java.awt.Font("Verdana", Font.BOLD, 25);
//        Graphics g = imagek.getGraphics();
//        //g.fillRect(0, 0, 900, 900);
//        g.setColor(Color.red);
//        g.setFont(font);
//        g.setColor(Color.red);
//        g.drawString("Hello World!", 20, 20);
//        g.setColor(Color.red);
//
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        ImageIO.write(imagek, "png", baos);
//        byte[] imageData = baos.toByteArray();
//
//        image = Image.getInstance(imageData);
////        documento.add(tfecha);
//        documento.add(image);
//
//    }

    
    private void DefinirEncabezado(Document documento) throws BadElementException, IOException
    {
//        Phrase imagen=new Phrase();
        
        Image image;
      
        BufferedImage imagek = ImageIO.read(new File(this.rutaEnc));
        
        String titleReport = titulodoc;
        
        java.awt.Font font;
        font = new java.awt.Font("Verdana", Font.BOLD, 50);   
        
        Integer length = titleReport.length();
          System.out.println(length);
        for(int i = 0; i < titleReport.length(); i++){
            char letter = titleReport.charAt(i);            
            if(letter == 'm' || letter == 'w'){                    
                length += 3;
            }                
        }
        Graphics g = imagek.getGraphics();
        //g.fillRect(0, 0, 900, 900);       
        g.setFont(font);
        g.setColor(Color.white);       
        
        documento.getPageSize().getWidth();
        
        g.drawString(titleReport, 1189 / 2 + (1189 / 4 - (length * 10) + 5) , 230/2 + 120);
        
        
        System.out.println("Actual position: " + (1189 / 2 + (1189 / 2 - (titleReport.length() * 65) + 20)));
        
        //System.out.println("Actual position: " + ((555 + (titleReport.length() * 50 * 2)) > 600 ? 1160 - (titleReport.length() * 50)  : 555 + (titleReport.length() * 50)));
        g.setColor(Color.red);
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(imagek, "png", baos);
        byte[] imageData = baos.toByteArray();        
        
        image = Image.getInstance(imageData);
        
        image.scaleAbsolute(900f, 230f);
        image.setAbsolutePosition(0, 960);
        
        documento.setMargins(15, documento.rightMargin(), documento.topMargin(), documento.bottomMargin());
        Chunk chunk = new Chunk(image, -15, 0);
        chunk.setBackground(new Color(0, 0, 0, 0));
        
        HeaderFooter header = new HeaderFooter(new Phrase(chunk), false);
        header.disableBorderSide(2);      
//        header.setTop(100f);
        header.setLeft(-15f);
        documento.setHeader(header);
        
//        documento.add(image);
    }
    
    
    private void imprimirTarea(DefaultTableModel data, Document documento)
    {
        System.out.println("imprimir tarea"+project);
        PdfPTable pdftable=null;
        Boolean bandera = true;
        for (int x = 0; x < data.getRowCount(); x++) {
            pdftable = new PdfPTable(data.getColumnCount());
            CabeceraPdf(pdftable, data);
            AsignarTitulo(documento,"Task and history update",false,15);
            for (int i = 0; i < data.getColumnCount(); i++) {
                pdftable.addCell(data.getValueAt(x, i).toString());
                if (bandera) 
                    ancho[i] = 2.3f;
            }
            bandera = false;
            DimencionesTabla(pdftable);
            documento.add(pdftable);
            ImprimirHistorialTarea(project,data.getValueAt(x, 0).toString(),documento);
        }

    }
    
    private Component_TaskDAO componenteTask;
    
    private void ImprimirHistorialTarea(String rutaProj,String idTask,Document documento)
    {
        reportDao = new ReportDao();
        String rutaProject=rutaAbs.replace("tddm4iotbs_documento","tddm4iotbs_projects");
        rutaProject=rutaProject+"\\"+rutaProj+"\\Entregables\\cb1\\Components\\cb2\\Tasks\\cb3.json";
        componenteTask=new Component_TaskDAO();
        DefaultTableModel table=componenteTask.readPathTask(idTask);
        String ruta="C:\\Users\\USUARIO\\Desktop\\version final v26\\TD4IOT\\storageTddm4IoTbs\\target\\storageTddm4IoTbs-1.0-SNAPSHOT\\tddm4iotbs_projects\\aEolPoOYUorZbSkpSkpMAwPoOYUoEolErTCNZYUondHnGqzHny115\\Entregables\\cb1\\Components\\cb2\\Tasks\\cb3.json";
        rutaProject=rutaProject.replace("cb1", table.getValueAt(0, 0).toString());
        rutaProject=rutaProject.replace("cb2", table.getValueAt(0, 1).toString());
        rutaProject=rutaProject.replace("cb3", table.getValueAt(0, 2).toString());
        FileAccess fileCreate = new FileAccess();
        JsonObject jsonTaskHistory=fileCreate.readFileJson(rutaProject);
        System.out.println(ruta);
        System.out.println(jsonTaskHistory.toString());
        //
        String query = String.format("select * from select_tasks_history('%s')", jsonTaskHistory.toString());
        DefaultTableModel tablaResultados=reportDao.queryReport(query);
        if(tablaResultados.getRowCount()>0){
            PdfPTable pdftable = new PdfPTable(tablaResultados.getColumnCount());
            CabeceraPdf(pdftable, tablaResultados);
            Boolean bandera = true;
            anchoH = new float[tablaResultados.getColumnCount()];
            for (int x = 0; x < tablaResultados.getRowCount(); x++) {
                for (int i = 0; i < tablaResultados.getColumnCount(); i++) {
                    pdftable.addCell(tablaResultados.getValueAt(x, i).toString());
                    if (bandera) 
                        anchoH[i] = 2.3f;
                }
                bandera = false;
            }
            pdftable.setSpacingBefore(30);
            pdftable.setWidths(anchoH);
            pdftable.setWidthPercentage(100);
            documento.add(pdftable);
        }
    }
    
    
    
    
    
}