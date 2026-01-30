package com.shareup.rental.dto;
public class ItemResponse {

    private String id;
    private String name;          
    private String pickupAddress;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }         
    public void setName(String name) { this.name = name; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
}
