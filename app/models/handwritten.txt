var mongoose = require('mongoose');

module.exports = mongoose.model('units', {
  UNIT_LIST: {
    UNIT : {
      $ : {
        ID : String /* int */,
        SHORT_NAME : String,
        ABBR : String,
        LONG_NAME : String
      },
      ROOM : {
        0 : {
          $ : {
            ID : String /* int */,
            LABEL : String,
            SEX : String
          },
          BED : {
            0 : {
              $ : {
                ID  : String /* int */,
                LABEL : String,
                POS_X : String /* int */,
                POS_Y : String /* int */
              },
              PATIENT : {
                $ : {
                  ID  : String /* int */,
                  LAST_NAME : String,
                  FIRST_NAME  : String,
                  AGE_STRING  : String,
                  SEX : String,
                  PHOTO_URL : String
                },
                LAB_RESULT_GROUP_LIST : {
                  LAB_RESULT_LIST : {
                    0 : {
                      $ : {
                        GROUP : String
                      },
                      LAB_RESULT : {
                        0 : {
                          ANALYSIS_LABEL : String,
                          VALIDATION_DATETIME : String,
                          RESULT_VALUE : String
                        }
                      }
                    }
                  }
                },
                ACT_GROUP : {
                  0 : {
                    $ : {
                      PLANNED_DATETIME : String,
                      PLANNED_DATETIME_DISPLAY : String,
                      VALID_ANTICIP : String /* int */,
                      TYPE : String,
                      TITLE : String,
                      SUBTITLE_1 : String,
                      SUBTITLE_2 : String,
                      COLOR : String,
                      RESERVE : Boolean
                    },
                    ACT : {
                      $ : {
                        ID : String /* int */,
                        TASK_ID : String /* int */,
                        TITLE : String,
                        SUBTITLE_1 : String,
                        SUBTITLE_2 : String,
                        PLANNED_DATETIME : String,
                        PLANNED_DATETIME_DISPLAY : String,
                        ACT_STATUS_CODE : String,
                        TASK_STATUS_CODE : String,
                        RESERVE : Boolean,
                        TYPE : String,
                        COLOR : String,
                        IDS_DAL : String /* int */
                      },
                      INFO_PART_LIST : {
                        INFO_PART : {
                          0 : {
                            _ : String,
                            $ : {
                              TYPE : String
                            }
                          }
                        }
                      },
                      PLANNED_DATE : {
                        _ : String,
                        $ : {
                          VALID_ANTICIP : String /* int */
                        }
                      },
                      INFORMATION : String,
                      INTERVENTION : {
                        $ : {
                          ID : String /* int */,
                          LABEL : String
                        },
                        INTERVENTION : {
                          $ : {
                            ID : String /* int */,
                            LABEL : String
                          },
                          INTERVENTION : {
                            $ : {
                              ID : String /* int */,
                              LABEL : String
                            },
                            INTERVENTION : {
                              $ : {
                                ID : String /* int */,
                                LABEL : String,
                                VALID_ANTICIP : String /* int */
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