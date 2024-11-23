/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package reports;

import DAO.Component_TaskDAO;
import DAO.ReportDao;
import com.google.gson.JsonObject;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import javax.swing.table.DefaultTableModel;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRField;
import util.FileAccess;

/**
 *
 * @author HECTOR CASANOVA
 */
public class ConfigDSource implements JRDataSource {

    private DefaultTableModel lstData;
    private DefaultTableModel lstDataJsonTask;
    private String[] querys;
    private Integer index;
    private Integer indexTask;
    private String idp;
    private Integer type;
    private ReportDao queryData;
    private String path;
    private String nameProject;
    private Boolean band;
    private Boolean part;

    public ConfigDSource(String idp, Integer type,String path,String nameProject,Boolean part) {

        this.part=part;
        band=true;
        index = -1;
        this.path=path;
        this.nameProject=nameProject;
        this.idp = idp;

        this.type = type;
        queryVec();
        
        queryData = new ReportDao();
         
        lstData = queryData.queryReport(this.querys[type - 1]);
             
        if(type.equals(3))
            historyTask();
        else
            ValidateEmpty();
    }

    @Override
    public boolean next() throws JRException {
        index++;
        return type.equals(3)?(index < lstDataJsonTask.getRowCount()):(index < lstData.getRowCount());
    }

    @Override
    public Object getFieldValue(JRField jrf) throws JRException {
        String nameColumn = jrf.getName();
        if (type.equals(1)) {
            if (nameColumn.equals("Name")) {
                return lstData.getValueAt(index, 0);
            } else if (nameColumn.equals("Description")) {
                return lstData.getValueAt(index, 1);
            } else if (nameColumn.equals("Status")) {
                return lstData.getValueAt(index, 2);
            } else if (nameColumn.equals("Creation_date")) {
                return lstData.getValueAt(index, 3);
            } else if (nameColumn.equals("Last_update")) {
                return lstData.getValueAt(index, 4);
            } else if (nameColumn.equals("Estimated_date")) {
                return lstData.getValueAt(index, 5);
            } else if (nameColumn.equals("Current_percentage")) {
                return lstData.getValueAt(index, 6);
            } else if (nameColumn.equals("Base_percentage")) {
                return lstData.getValueAt(index, 7);
            }else if(nameColumn.equals("finishdate_entregable")){
                return lstData.getValueAt(index, 8);
            }
        } else if (type.equals(2)) {
            if (nameColumn.equals("Name")) {
                return lstData.getValueAt(index, 0);
            } else if (nameColumn.equals("Description")) {
                return lstData.getValueAt(index, 1);
            } else if (nameColumn.equals("Creation_date")) {
                return lstData.getValueAt(index, 2);
            } else if (nameColumn.equals("Last_update")) {
                return lstData.getValueAt(index, 3);
            } else if (nameColumn.equals("Estimated_date")) {
                return lstData.getValueAt(index, 4);
            } else if (nameColumn.equals("Current_percentage")) {
                return lstData.getValueAt(index, 5);
            } else if (nameColumn.equals("Base_percentage")) {
                return lstData.getValueAt(index, 6);
            }else if(nameColumn.equals("finishdate_component"))
                return lstData.getValueAt(index,7);
        } else if (type.equals(3)) {
            

            if (nameColumn.equals("Name")) {
                    return lstDataJsonTask.getValueAt(index, 1);  
                } else if (nameColumn.equals("Description")) {
                    return lstDataJsonTask.getValueAt(index, 2);
                } else if (nameColumn.equals("Creation_date")) {
                    return lstDataJsonTask.getValueAt(index, 3);
                } else if (nameColumn.equals("Last_update")) {
                    return lstDataJsonTask.getValueAt(index, 4);
                } else if (nameColumn.equals("Estimated_date")) {
                    return lstDataJsonTask.getValueAt(index, 5);
                } else if (nameColumn.equals("Current_percentage")) {
                    return lstDataJsonTask.getValueAt(index, 6);
                } else if (nameColumn.equals("Base_percentage")) {
                    return lstDataJsonTask.getValueAt(index, 7);
                }else if(nameColumn.equals("finishdate_task")){
                    return lstDataJsonTask.getValueAt(index, 8);
                }else if(nameColumn.equals("precentage")){
                    return lstDataJsonTask.getValueAt(index, 9);
                }else if(nameColumn.equals("description")){
                    return lstDataJsonTask.getValueAt(index, 10);
                }else if(nameColumn.equals("update_date")){
                    return lstDataJsonTask.getValueAt(index, 11);
                }
       
        } else if (type.equals(4)) {
            if (nameColumn.equals("name_entregable")) {
                return lstData.getValueAt(index, 0);
            } else if (nameColumn.equals("description_entregable")) {
                return lstData.getValueAt(index, 1);
            } else if (nameColumn.equals("status_entregable")) {
                return lstData.getValueAt(index, 2);
            } else if (nameColumn.equals("creationdate_entregable")) {
                return lstData.getValueAt(index, 3);
            } else if (nameColumn.equals("updatedate_entregable")) {
                return lstData.getValueAt(index, 4);
            } else if (nameColumn.equals("stimateddate_entregable")) {
                return lstData.getValueAt(index, 5);
            } else if (nameColumn.equals("finishdate_entregable")) {
                return lstData.getValueAt(index, 6);
            } else if (nameColumn.equals("actual_percentage_entregable")) {
                return lstData.getValueAt(index, 7);
            } else if (nameColumn.equals("base_percentage_entregable")) {
                return lstData.getValueAt(index, 8);
            } else if (nameColumn.equals("name_component")) {
                return lstData.getValueAt(index, 9);
            } else if (nameColumn.equals("description_component")) {
                return lstData.getValueAt(index, 10);
            } else if (nameColumn.equals("status_component")) {
                return lstData.getValueAt(index, 11);
            } else if (nameColumn.equals("actual_percentage_component")) {
                return lstData.getValueAt(index, 12);
            } else if (nameColumn.equals("base_percentage_component")) {
                return lstData.getValueAt(index, 13);
            } else if (nameColumn.equals("creationdate_component")) {
                return lstData.getValueAt(index, 14);
            } else if (nameColumn.equals("updatedate_component")) {
                return lstData.getValueAt(index, 15);
            } else if (nameColumn.equals("stimateddate_component")) {
                return lstData.getValueAt(index, 16);
            } else if (nameColumn.equals("finishdate_component")) {
                return lstData.getValueAt(index, 17);
            } else if (nameColumn.equals("name_task")) {
                return lstData.getValueAt(index, 18);
            } else if (nameColumn.equals("description_task")) {
                return lstData.getValueAt(index, 19);
            } else if (nameColumn.equals("status_task")) {
                return lstData.getValueAt(index, 20);
            } else if (nameColumn.equals("base_percentage_task")) {
                return lstData.getValueAt(index, 21);
            } else if (nameColumn.equals("actual_percentage_task")) {
                return lstData.getValueAt(index, 22);
            } else if (nameColumn.equals("creationdate_task")) {
                return lstData.getValueAt(index, 23);
            } else if (nameColumn.equals("updatedate_task")) {
                return lstData.getValueAt(index, 24);
            } else if (nameColumn.equals("stimateddate_task")) {
                return lstData.getValueAt(index, 25);
            }else if (nameColumn.equals("finishdate_task")) {
                return lstData.getValueAt(index, 26);
            }
        }
        return null;
    }

    private void ValidateEmpty() {

        Object[] dataEmpty = new Object[lstData.getColumnCount()];
        if (lstData.getRowCount() < 1) {
            for (int x = 0; x < lstData.getColumnCount(); x++) {
                dataEmpty[x] = " ";
            }
            lstData.addRow(dataEmpty);
        }
    }

    private void queryVec() {
        String[] querys = {"select name_entregable as Name,description_entregable as Description,\n" +
            "status_entregable as Status,creationdate_entregable::date as Creation_date,updatedate_entregable::date as Last_update,\n" +
            "stimateddate_entregable::date as Estimated_date,actual_percentage_entregable as Current_percentage,\n" +
            "base_percentage_entregable as Base_percentage,\n" +
            "finishdate_entregable\n" +
            "from project_entregable\n" +
            "where id_masterproject ="+idp,
            "Select name_component as Name,description_component as Description,\n" +
            "creationdate_component::date as Creation_date,updatedate_component::date as Last_update,stimateddate_component::date as Estimated_date,\n" +
            "actual_percentage_component as Current_percentage, base_percentage_component as Base_percentage,\n" +
            "finishdate_component\n" +
            "from project_entregable_component\n" +
            "where id_entregable="+idp,
            "select id_task as Id\n" +
            "from entregable_component_task\n" +
            "where id_component="+idp,
            "select pe.name_entregable,pe.description_entregable,\n"
            + "pe.status_entregable,pe.creationdate_entregable,pe.updatedate_entregable,\n"
            + "pe.stimateddate_entregable,pe.finishdate_entregable,pe.actual_percentage_entregable,\n"
            + "pe.base_percentage_entregable,\n"
            + "pec.name_component,pec.description_component,pec.status_component,\n"
            + "pec.actual_percentage_component,pec.base_percentage_component,\n"
            + "pec.creationdate_component,pec.updatedate_component,\n"
            + "pec.stimateddate_component,pec.finishdate_component,\n"
            + "pet.name_task,pet.description_task,pet.status_task,pet.base_percentage_task,\n"
            + "pet.actual_percentage_task,\n"
            + "pet.creationdate_task,pet.updatedate_task,pet.stimateddate_task\n"
            + ", pet.finishdate_task from project_entregable pe \n"
            + "left join project_entregable_component pec on pe.id_entregable=pec.id_entregable\n"
            + "left join entregable_component_task pet on pec.id_entregable_component=pet.id_component\n"
            + (part?"where pe.id_masterproject =":"where pe.id_entregable=") + idp};
       
        this.querys = querys;
    }

    
    public static JRDataSource getData(String idp, Integer type,String path,String nameProject,Boolean part) {
        return new ConfigDSource(idp, type,path,nameProject,part);
    }
    
    
    private void historyTask()
    {
        if(lstData.getRowCount()>0){
            ReportDao reportDao = new ReportDao();
            String nj="";
            for(int i=0;i<lstData.getRowCount();i++)
            {
                String rutaProject=this.path;
                rutaProject=rutaProject+"\\"+this.nameProject+"\\Entregables\\cb1\\Components\\cb2\\Tasks\\cb3.json";
                Component_TaskDAO componenteTask=new Component_TaskDAO();
                DefaultTableModel table=componenteTask.readPathTask(lstData.getValueAt(i,0).toString());
                rutaProject=rutaProject.replace("cb1", table.getValueAt(0, 0).toString());
                rutaProject=rutaProject.replace("cb2", table.getValueAt(0, 1).toString());
                rutaProject=rutaProject.replace("cb3", table.getValueAt(0, 2).toString());
                FileAccess fileCreate = new FileAccess();
                
                if(fileCreate.FolderExists(rutaProject)){
                   
                    
                    JsonObject jsonTaskHistory=fileCreate.readFileJson(rutaProject);
                    String json=jsonTaskHistory.toString();
                    String jsonaux=json.substring(json.indexOf("["), json.indexOf("]")+1);
                   
                    int intIndex = json.indexOf("\"id_task\":\"");
                    String dataN=json.substring(intIndex, json.length()-1);
                    for(int x=1;x<jsonaux.length();x++)
                    {
                        char letter=jsonaux.toCharArray()[x];
                        if(!(letter+"").equals("]"))
                        {
                            if((jsonaux.toCharArray()[x+1]+"").equals("}"))
                                nj+="\","+dataN;
                            else
                                nj+=letter;
                        }else 
                            break;
                    }
                    nj=nj+",";
                }
                else{
                    DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");  
                    LocalDateTime now = LocalDateTime.now();  
                    nj = nj + "{\"percentage\":\"0\",\"description\":\"First insertion\",\"update_date\":\"" + dtf.format(now) + "\",\"id_task\":\"" + lstData.getValueAt(i,0).toString()+ "\"},";
                }
            }
                
            
            String jsonEnd="["+nj.substring(0, nj.length()-1)+"]";
            
            String query = String.format("select * from select_tasks_history('%s',%s)", jsonEnd,idp);

            lstDataJsonTask=reportDao.queryReport(query);
            
        }else
        {
            lstDataJsonTask=new DefaultTableModel();
            Object[] columns={"Id","Name","Description","Creation_date","Last_update","Estimated_date","Current_percentage",
            "Base_percentage","finishdate_task","precentage","description","update_date"};
            for (Object column : columns) {
                lstDataJsonTask.addColumn(column);
            }

            Object[] dataEmpty = new Object[columns.length];
            for (int x = 0; x < lstDataJsonTask.getColumnCount(); x++) {
                dataEmpty[x] = " ";
            }
            lstDataJsonTask.addRow(dataEmpty);
        }
    }

 
}