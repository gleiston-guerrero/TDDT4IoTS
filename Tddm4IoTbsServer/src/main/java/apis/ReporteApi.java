/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package apis;

import Controller.ReportesCtrl;
import DAO.ReportDao;
import com.google.gson.JsonObject;
import com.lowagie.text.BadElementException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import javax.swing.table.DefaultTableModel;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import net.sf.jasperreports.engine.JRException;
import reports.FillAndExport;
import util.DataStatic;
import util.Methods;
import util.WeEncoder;

/**
 *
 * @author USUARIO
 */
@Path("reportes")
public class ReporteApi {
    
    @Context
    private HttpServletRequest request;
    
    String rutaAbs;
    String titulo;
    private ReportDao reportDao;
    private DefaultTableModel tabla;
//    private DefaultTableModel [] tablaaux;
    private File file;
    private String [] consultas;
    
    private WeEncoder encoder;
    
    public ReporteApi()
    {
        reportDao=new ReportDao();
        consultas=new String [3];
        encoder=new WeEncoder();
    }
    
    @GET
    @Path("/exportarPdf")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getProjects(@QueryParam("select") Integer selection,
                                @QueryParam("type") String type,
                                @QueryParam("rutap")String nameProject,
                                @QueryParam("part")Boolean part,
                                @QueryParam("cad")String tittle) throws BadElementException, IOException, JRException {

        if(nameProject == null)
            nameProject="";
        if(part == null)
            part=true;

        if(selection.equals(1) || (selection.equals(4) && part.equals(true)))
            type=encoder.textDecryptor(type);

        String path=request.getServletContext().getRealPath("");
        FillAndExport fe=new FillAndExport(type,selection,path.substring(0, path.indexOf("TD4IOT")+7),path,nameProject,part,tittle);
        File file=fe.fillAndExport();
            
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        Date date = new Date();
        String fechaActual = formatter.format(date);
        

        return Response.ok(file)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .header("Content-Disposition", "attachment; filename=archivo_"+fechaActual+".pdf")
                .type(MediaType.APPLICATION_OCTET_STREAM)
                .build();
    }

}