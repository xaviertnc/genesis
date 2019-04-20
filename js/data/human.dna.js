var HumanDNA = [

  { // HEAD
    blocktype: 'head',
    wants: [
      {
        wants: 'hair',
        howMany: 1,
        connectors: { // Connector(s) on the HEAD block for HAIR.
          position: { // HAIR connector position on HEAD block.
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on HEAD block.
              top: { top_left: {x:50 y:5}, bottom_right: {x:50, y:10}, unit: '%' }
            }
          }
        }
      },
      {
        wants: 'eye',
        howMany: { min: 1, max: 4 },
        connectors: { // Connector(s) on the HEAD block for EYES.
          position: { // EYE connector positions on HEAD block.
            valueFn: 'anyAvailableZone',
            allowedZones: { // Multiple allowed placement zones!
              left:   { top_left: {x:25, y:40}, bottom_right: {x:30, y:45}, unit: '%' },
              right:  { top_left: {x:70, y:40}, bottom_right: {x:75, y:45}, unit: '%' },
              center: { top_left: {x:50, y:25}, bottom_right: {x:50 ,y:30}, unit: '%' }
            }
          }
        },
        wantedBlockFilters: [
          { test: 'wantedBlockSide', match: 'connectorSide' }
        ]
      },
      {
        wants: 'ear',
        howMany: 2,
        connectors: { // Connector(s) on the HEAD block for EAR.
          position: { // EAR connector positions on HEAD block.
            valueFn: 'anyAvailableZone',
            allowedZones: { // Allowed placement zones on HEAD block.
              left:  { top_left: {x:0,  y:45}, bottom_right: {x:5,   y:45}, unit: '%' },
              right: { top_left: {x:95, y:50}, bottom_right: {x:100, y:50}, unit: '%' }
            }
          }
        },
        wantedBlockFilters: [
          { test: 'wantedBlockSide', match: 'connectorSide' }
        ]
      },
      {
        wants: 'nose',
        howMany: 1,
        connectors: { // Connector(s) on the HEAD block for NOSE.
          position: { // NOSE connector position on HEAD block.
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on HEAD block.
              center: { top_left: {x:50, y:45}, bottom_right: {x:50, y:55}, unit: '%' }
            }
          }
        }
      },
      {
        wants: 'mouth',
        howMany: 1,
        connectors: { // Connector(s) on the HEAD block for MOUTH.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on HEAD block.
              belowCenter: { top_left: {x:50, y:80}, bottom_right: {x:50, y:90}, unit: '%' }
            }
          }
        }
      },
      {
        wants: 'neck',
        howMany: 1,
        connectors: { // Connector(s) on the HEAD block for NECK.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on HEAD block.
              bottom: { top_left: {x:50, y:90}, bottom_right: {x:50, y:100}, unit: '%' }
            }
          }
        }
      }
    ],
    has: {
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'selectOne'
      }
    }
  },

  { // HAIR
    blocktype: 'hair',
    wants: [
      {
        wants: 'head',
        howMany: 1,
        connectors: { // Connector(s) on the HAIR block for a HEAD.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on HAIR block.
              belowCenter: { top_left: {x:50, y:50}, bottom_right: {x:50, y:100}, unit: '%' }
            }
          }
        }
      }
    ],
    has: {
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'selectOne'
      }
    }
  },

  { // EAR
    blocktype: 'ear',
    wants: [
      {
        wants: 'head',
        howMany: 1,
        connectors: { // Connector(s) on the EAR block for a HEAD.
          position: {
            valueFn: 'oppositeParentConnectorSide',
            allowedZones: {  // Allowed placement zones on EAR block.
              left:  { top_left: {x:0,  y:50}, bottom_right: {x:0,   y:50}, unit: '%' },
              right: { top_left: {x:95, y:50}, bottom_right: {x:100, y:50}, unit: '%' }
            }
          }
        }
      }
    ],
    has: {
      side: {
        valueFn: 'selectOne',
        options: ['left', 'right']
      },
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'matchSide'
      }
    }
  },

  { // EYE
    blocktype: 'eye',
    wants: [
      {
        wants: 'head',
        howMany: 1,
        connectors: { // Connector(s) on the EYE block for a HEAD.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on EYE block.
              center:  { top_left: {x:50, y:50}, bottom_right: {x:50, y:50}, unit: '%' }
            }
          }
        }
      }
    ],
    has: {
      side: {
        valueFn: 'weightSelectOne',
        options: { left: 45, right: 45, center: 10 }
      },
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'matchSide'
      }
    }
  },

  { // NOSE
    blocktype: 'nose',
    wants: [
      {
        wants: 'head',
        howMany: 1,
        connectors: { // Connector(s) on the NOSE block for a HEAD.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on NOSE block.
              center:  { top_left: {x:50, y:50}, bottom_right: {x:50, y:50}, unit: '%' }
            }
          }
        }
      }
    ],
    has: {
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'selectOne'
      }
    }
  },

  { // MOUTH
    blocktype: 'mouth',
    wants: [
      {
        wants: 'head',
        howMany: 1,
        connectors: { // Connector(s) on the MOUTH block for a HEAD.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on MOUTH block.
              center:  { top_left: {x:50, y:50}, bottom_right: {x:50, y:50}, unit: '%' }
            }
          }
        }
      }
    ],
    has: {
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'selectOne'
      }
    }
  },

  { // NECK
    blocktype: 'neck',
    wants: [
      {
        wants: 'head',
        howMany: 1,
        connectors: { // Connector(s) on the NECK block for a HEAD.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on NECK block.
              top: { top_left: {x:50, y:0}, bottom_right: {x:50, y:1}, unit: '%' }
            }
          }
        }
      },
      {
        wants: 'torso',
        howMany: 1,
        connectors: { // Connector(s) on the NECK block for a TORSO.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on NECK block.
              bottom: { top_left: {x:50, y:99}, bottom_right: {x:50,y:100}, unit: '%' }
            }
          }
        }
      }
    ],
    has: {
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'selectOne'
      }
    }
  },

  { // TORSO
    blocktype: 'torso',
    wants: [
      {
        wants: 'neck',
        howMany: 1,
        connectors: { // Connector(s) on the TORSO block for a NECK.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on TORSO block.
              top: { top_left: {x:50, y:0}, bottom_right: {x:50,y:1}, unit: '%' }
            }
          }
        }
      },
      {
        wants: 'arm',
        howMany: 2,
        connectors: { // Connector(s) on the TORSO block for ARMS.
          position: { // ARM connector positions on TORSO block.
            valueFn: 'anyAvailableZone',
            allowedZones: { // Allowed placement zones on TORSO block.
              left:  { top_left: {x:0,  y:20}, bottom_right: {x:5,   y:30}, unit: '%' },
              right: { top_left: {x:95, y:20}, bottom_right: {x:100, y:30}, unit: '%' }
            }
          }
        },
        wantedBlockFilters: [
          { test: 'wantedBlockSide', match: 'connectorSide' }
        ]
      },
      {
        wants: 'hips',
        howMany: 1,
        connectors: { // Connector(s) on the TORSO block for HIPS.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on TORSO block.
              bottom: { top_left: {x:50, y:90}, bottom_right: {x:50,y:100}, unit: '%' }
            }
          }
        }
      }
    ],
    has: {
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'selectOne'
      }
    }
  },

  { // ARM
    blocktype: 'arm',
    wants: [
      {
        wants: 'torso',
        howMany: 1,
        connectors: { // Connector(s) on the ARM block for a TORSO.
          position: {
            valueFn: 'oppositeBlockSide',
            allowedZones: {  // Allowed placement zones on ARM block.
              left:  { top_left: {x:0,  y:50}, bottom_right: {x:5,   y:50}, unit: '%' },
              right: { top_left: {x:95, y:50}, bottom_right: {x:100, y:50}, unit: '%' }
            }
          }
        }
      },
      {
        wants: 'hand',
        howMany: 1,
        connectors: { // Connector(s) on the ARM block for a HAND.
          position: {
            valueFn: 'blockSide',
            allowedZones: {  // Allowed placement zones on ARM block.
              left:  { top_left: {x:0,  y:50}, bottom_right: {x:5,   y:50}, unit: '%' },
              right: { top_left: {x:95, y:50}, bottom_right: {x:100, y:50}, unit: '%' }
            }
          }
        },
        wantedBlockFilters: [
          { test: 'wantedBlockSide', match: 'connectorSide' }
        ]
      }
    ],
    has: {
      side: {
        valueFn: 'selectOne',
        options: ['left', 'right'],
      },
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'matchSide'
      }
    }
  },

  { // HAND
    blocktype: 'hand',
    wants: [
      {
        wants: 'arm',
        howMany: 1,
        connectors: { // Connector(s) on the HAND block for a ARM.
          position: {
            valueFn: 'oppositeBlockSide',
            allowedZones: {  // Allowed placement zones on HAND block.
              left:  { top_left: {x:0,  y:50}, bottom_right: {x:5,   y:50}, unit: '%' },
              right: { top_left: {x:95, y:50}, bottom_right: {x:100, y:50}, unit: '%' }
            }
          }
        },
        wantedBlockFilters: [
          { test: 'wantedBlockSide', match: 'connectorSide' }
        ]
      }
    ],
    has: {
      side: {
        valueFn: 'selectOne',
        options: ['left', 'right']
      },
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'matchSide'
      }
    }
  },

  { // HIPS
    blocktype: 'hips',
    wants: [
      {
        wants: 'torso',
        howMany: 1,
        connectors: { // Connector(s) on the HIPS block for a TORSO.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on HIPS block.
              top:  { top_left: {x:50, y:0}, bottom_right: {x:50, y:5}, unit: '%' }
            }
          }
        }
      },
      {
        wants: 'leg',
        howMany: 2,
        connectors: { // Connector(s) on the HIPS block for a LEG.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on HIPS block.
              left:  { top_left: {x:20,  y:95}, bottom_right: {x:25,  y:100}, unit: '%' },
              right: { top_left: {x:75, y:95}, bottom_right: {x:80, y:100}, unit: '%' }
            }
          }
        },
        wantedBlockFilters: [
          { test: 'wantedBlockSide', match: 'connectorSide' }
        ]
      }
    ],
    has: {
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'selectOne'
      }
    }
  },

  { // LEG
    blocktype: 'leg',
    wants: [
      {
        wants: 'hips',
        howMany: 1,
        connectors: { // Connector(s) on the LEG block for HIPS.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on LEG block.
              top:  { top_left: {x:50, y:0}, bottom_right: {x:50, y:5}, unit: '%' }
            }
          }
        }
      },
      {
        wants: 'foot',
        howMany: 1,
        connectors: { // Connector(s) on the LEG block for a FOOT.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on LEG block.
              bottom:  { top_left: {x:50, y:95}, bottom_right: {x:50, y:100}, unit: '%' }
            }
          }
        },
        wantedBlockFilters: [
          { test: 'wantedBlockSide', match: 'blockSide' }
        ]
      }
    ],
    has: {
      side: {
        valueFn: 'selectOne',
        options: ['left', 'right']
      },
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'matchSide'
      }
    }
  },

  { // FOOT
    blocktype: 'foot',
    wants: [
      {
        wants: 'leg',
        howMany: 1,
        connectors: { // Connector(s) on the FOOT block for a LEG.
          position: {
            valueFn: 'anyAvailableZone',
            allowedZones: {  // Allowed placement zones on FOOT block.
              top:  { top_left: {x:50, y:0}, bottom_right: {x:50, y:10}, unit: '%' }
            }
          }
        },
        wantedBlockFilters: [
          { test: 'wantedBlockSide', match: 'blockSide' }
        ]
      }
    ],
    has: {
      side: {
        valueFn: 'selectOne',
        options: ['left', 'right']
      },
      color: {
        valueFn: 'randomColor'
      },
      image: {
        valueFn: 'matchSide'
      }
    }
  }

];
