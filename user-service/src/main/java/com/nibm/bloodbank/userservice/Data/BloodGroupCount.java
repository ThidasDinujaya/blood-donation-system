package com.nibm.bloodbank.userservice.Data;

public class BloodGroupCount {
    private String bloodGroup;
    private long count;

    public BloodGroupCount(String bloodGroup, long count) {
        this.bloodGroup = bloodGroup;
        this.count = count;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}