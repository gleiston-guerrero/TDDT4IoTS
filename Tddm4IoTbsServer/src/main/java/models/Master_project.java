/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import org.json.JSONObject;
import org.json.XML;

/**
 *
 * @author tonyp
 */
public class Master_project {

    String id_masterproject = "";
    String creationdate_mp = "";
    String updatedate_mp = "";
    String name_mp = "";
    String code_mp = "";
    String description_mp = "";
    String path_mp = "";
    String tatus_uml = "";
    String status_iot = "";
    String download = "";
    String download_ang = "";
    String download_all = "";

    public String getId_masterproject() {
        return id_masterproject;
    }

    public void setId_masterproject(String id_masterproject) {
        this.id_masterproject = id_masterproject;
    }

    public String getCreationdate_mp() {
        return creationdate_mp;
    }

    public void setCreationdate_mp(String creationdate_mp) {
        this.creationdate_mp = creationdate_mp;
    }

    public String getUpdatedate_mp() {
        return updatedate_mp;
    }

    public void setUpdatedate_mp(String updatedate_mp) {
        this.updatedate_mp = updatedate_mp;
    }

    public String getName_mp() {
        return name_mp;
    }

    public void setName_mp(String name_mp) {
        this.name_mp = name_mp;
    }

    public String getCode_mp() {
        return code_mp;
    }

    public void setCode_mp(String code_mp) {
        this.code_mp = code_mp;
    }

    public String getDescription_mp() {
        return description_mp;
    }

    public void setDescription_mp(String description_mp) {
        this.description_mp = description_mp;
    }

    public String getPath_mp() {
        return path_mp;
    }

    public void setPath_mp(String path_mp) {
        this.path_mp = path_mp;
    }

    public String getTatus_uml() {
        return tatus_uml;
    }

    public void setTatus_uml(String tatus_uml) {
        this.tatus_uml = tatus_uml;
    }

    public String getStatus_iot() {
        return status_iot;
    }

    public void setStatus_iot(String status_iot) {
        this.status_iot = status_iot;
    }

    public String getDownload() {
        return download;
    }

    public void setDownload(String download) {
        this.download = download;
    }

    
    public String returnXml() {
        JSONObject jsonU = new JSONObject(this);
        return "<master_project>" + XML.toString(jsonU) + "</master_project>";
    }

    public String getDownload_ang() {
        return download_ang;
    }

    public void setDownload_ang(String download_ang) {
        this.download_ang = download_ang;
    }

    public String getDownload_all() {
        return download_all;
    }

    public void setDownload_all(String download_all) {
        this.download_all = download_all;
    }
    
    
}
