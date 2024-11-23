/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package util;

import Controller.Entregable_MembersCtrl;
import Controller.Entregable_ComponentCtrl;
import Controller.Master_projectCtrl;
import Controller.Project_EntregableCtrl;
import DAO.Entregable_MembersDAO;
import DAO.Master_projectDAO;
import com.google.gson.JsonArray;
import models.Entregable_Members;
import models.Entregable_Component;
import models.Project_Entregable;

/**
 *
 * @author tonyp
 */
public class test {

    public static void main(String[] args) {
//        String path = "D:/0_universidad/0_repositorio/umleasyiotrep/storageTddm4IoTbs/target/storageTddm4IoTbs-1.0-SNAPSHOT/";
//
//        String rel = "tddm4iotbs_projects/velocmetroEolPoOSkpYUoEolrZbErTtjyCNZYUotjyZaiZaioJZpfEhoSk22/UmlDiagram/";
//
////        MakerProjects.generateMavenProject(path, rel, "PruebaVehículoAlgo");
//        MakerProjects.MaketarMaven(path, rel); 
//        
//        
//        Project_EntregableCtrl entregable = new Project_EntregableCtrl();        
//        
//        Project_Entregable entregableProg = new Project_Entregable();
//        entregableProg.setId_masterproject("1242");
//        entregableProg.setName_entregable("Creación de módulo de compras");
//        entregableProg.setDescription_entregable("Descripcion nueva para mi entregable");
//        entregableProg.setPath_entregable("ruta");
//        entregableProg.setStatus_entregable("A");
//        entregableProg.setPrioritylevel_entregable("1");
//        entregableProg.setBase_percentage_entregable("20");
//        entregableProg.setActual_percentage_entregable("100");
//        entregableProg.setStimateddate_entregable("2022-12-15");
//        entregableProg.setFinishdate_entregable("2022-12-19");
//        
//        System.out.println(entregableProg.returnXml());
//        System.out.println(entregableProg.returnXml());

        //entregable.insertNewEntregable(entregableProg.returnXml());
        //entregable.insertNewEntregable(entregableProg.returnXml());
        //String valores = entregable.selectEntregables("2", "m6afwENti/Y=");
        
        /*System.out.println(valores);
       
        */
        //System.out.println(b[0]);
        /*
        Entregable_Component task = new Entregable_Component();
        task.setId_entregable("18");
        task.setName_component("Actividad principal");
        task.setDescription_component("Descripcion de actividad");
        task.setStatus_component("A");
        task.setVisibility_component("V");        
        task.setPath_component("rutaTarea/aaaa");
        task.setBase_percentage_component("25");
        task.setActual_percentage_component("100");
        task.setStimateddate_component("12-12-2024");
        task.setFinishdate_component("10-12-2024");
        
        System.out.println(task.returnXml());
        
        
        Entregable_ComponentCtrl ctrl = new Entregable_ComponentCtrl();        
        //ctrl.insertNewEntregableTask(task.returnXml());
        //String [] response = ctrl.selectEntregableTask("1", "1");
        String [] response = ctrl.selectEntregableTask("1", "18");
        System.out.println("a");
        System.out.println(response[2]);
        
        /*
        /*Master_projectCtrl projectmaster = new Master_projectCtrl();
        String res = projectmaster.selectProjectById("1242");
        System.out.println(res);*/
        
        //Create task:
        
       /* Entregable_Members members = new Entregable_Members();
        members.setId_person("115");
        members.setId_project_task("5");
        members.setRole_member("F");
        members.setStatus_member("A");

        Entregable_MembersCtrl memberCtrl = new Entregable_MembersCtrl();
        String [] response = memberCtrl.selectMembersEntregable("1","6");
        
        System.out.println(response[0] + "  "  + response[1]);        */
       
       //WeEncoder encoder = new WeEncoder();
        System.out.println("PRUEBA CONTRASENIA: \n");
        System.out.println(WeEncoder.encodeANGY("megadatos"));
        System.out.println(WeEncoder.decodeANGY("d29xa25rZHlj"));
        
    }
}
