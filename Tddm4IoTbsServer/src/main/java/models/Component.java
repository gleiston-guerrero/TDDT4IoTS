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
 * @author tonyp This class refers to the components of IoT system, which are
 * stored in the database.
 */
public class Component {

    /**
     * Get and set methods concerning components of IoT System, which are simple
     * methods we use in classes to display (get) or modify (set) the value of
     * an attribute. Each of the get methods returns a string and los métodos
     * set them a void, and the validation will be done on the controllers.
     */
    private String id_component = "";
    private String name_component = "";
    private String description_component = "";
    private String type_component = "";
    private String active_component = "";
    private String pathimg_component = "";
    private String pathports_component = "";
    private String uploaddate_component = "";
    private String person_id_person = "";

    public Component() {
    }

    public String getId_component() {
        return id_component;
    }

    public void setId_component(String id_component) {
        this.id_component = id_component;
    }

    public String getName_component() {
        return name_component;
    }

    public void setName_component(String name_component) {
        this.name_component = name_component;
    }

    public String getDescription_component() {
        return description_component;
    }

    public void setDescription_component(String description_component) {
        this.description_component = description_component;
    }

    public String getType_component() {
        return type_component;
    }

    public void setType_component(String type_component) {
        this.type_component = type_component;
    }

    public String getActive_component() {
        return active_component;
    }

    public void setActive_component(String active_component) {
        this.active_component = active_component;
    }

    public String getPathimg_component() {
        return pathimg_component;
    }

    public void setPathimg_component(String pathimg_component) {
        this.pathimg_component = pathimg_component;
    }

    public String getPathports_component() {
        return pathports_component;
    }

    public void setPathports_component(String pathports_component) {
        this.pathports_component = pathports_component;
    }

    public String getUploaddate_component() {
        return uploaddate_component;
    }

    public void setUploaddate_component(String uploaddate_component) {
        this.uploaddate_component = uploaddate_component;
    }

    public String getPerson_id_person() {
        return person_id_person;
    }

    public void setPerson_id_person(String person_id_person) {
        this.person_id_person = person_id_person;
    }

    /**
     * This XML is to make inserts or updates in the database concerning the
     * components of IoT system
     *
     * @return Returns a String as XML
     */
    public String returnXml() {
        JSONObject jsonU = new JSONObject(this);
        return "<component>" + XML.toString(jsonU) + "</component>";
    }
}
