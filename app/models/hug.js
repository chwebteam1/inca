var mongoose = require('mongoose');

module.exports = mongoose.model('unites', {
  "id": String,
  "type": Object,
  "properties": {
    "UNIT_LIST": {
      "id": "UNIT_LIST",
      "type": Object,
      "properties": {
        "UNIT": {
          "id": "UNIT",
          "type": Object,
          "properties": {
            "ROOM": {
              "id": "ROOM",
              "type": Array,
              "items": {
                "id": "1",
                "type": Object,
                "properties": {
                  "BED": {
                    "id": "BED",
                    "type": Array,
                    "items": {
                      "id": "1",
                      "type": Object,
                      "properties": {
                        "PATIENT": {
                          "id": "PATIENT",
                          "type": Object,
                          "properties": {
                            "ACT_GROUP": {
                              "id": "ACT_GROUP",
                              "type": Object,
                              "properties": {
                                "ACT": {
                                  "id": "ACT",
                                  "type": Object,
                                  "properties": {
                                    "INFO_PART_LIST": {
                                      "id": "INFO_PART_LIST",
                                      "type": Object,
                                      "properties": {
                                        "INFO_PART": {
                                          "id": "INFO_PART",
                                          "type": Array,
                                          "items": {
                                            "id": "2",
                                            "type": Object,
                                            "properties": {
                                              "_": {
                                                "id": "_",
                                                "type": String
                                              }
                                            }
                                          }
                                        }
                                      }
                                    },
                                    "PLANNED_DATE": {
                                      "id": "PLANNED_DATE",
                                      "type": Object,
                                      "properties": {
                                        "_": {
                                          "id": "_",
                                          "type": String
                                        }
                                      }
                                    },
                                    "INFORMATION": {
                                      "id": "INFORMATION",
                                      "type": String
                                    },
                                    "INTERVENTION": {
                                      "id": "INTERVENTION",
                                      "type": Object,
                                      "properties": {
                                        "INTERVENTION": {
                                          "id": "INTERVENTION",
                                          "type": Object,
                                          "properties": {
                                            "INTERVENTION": {
                                              "id": "INTERVENTION",
                                              "type": Object,
                                              "properties": {
                                                "INTERVENTION": {
                                                  "id": "INTERVENTION",
                                                  "type": Object,
                                                  "properties": {}
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});