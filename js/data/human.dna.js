var HumanDNA = [

  {// HEAD
    block: 'head',
    wants: [
      {
        type: 'hair',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:5}, bottom_right: {x:50, y:10}, unit: '%' }
            }
          },
          conditions: []
        }
      },
      {
        type: 'eye',
        min: 1,
        max: 4,
        connector: {
          props: {
            side: {
              gen: 'connector.side',
              choose: 'random-free',
              options: [ 'left', 'right', 'center' ]
            },
            pos: {
              gen: 'connector.pos',
              choose: 'connector-side',
              options: {
                left:   { top_left: {x:25, y:40}, bottom_right: {x:30, y:45}, unit: '%' },
                right:  { top_left: {x:70, y:40}, bottom_right: {x:75, y:45}, unit: '%' },
                center: { top_left: {x:50, y:25}, bottom_right: {x:50 ,y:30}, unit: '%' }
              }
            }
          },
          conditions: [ 'want_same_side' ]
        }
      },
      {
        type: 'ear',
        count: 2,
        connector: {
          props: {
            side: {
              gen: 'connector.side',
              choose: 'next-free',
              options: [ 'left', 'right' ]
            },
            pos: {
              gen: 'connector.pos',
              choose: 'connector-side',
              options: {
                left:  { top_left: {x:0,  y:45}, bottom_right: {x:5,   y:45}, unit: '%' },
                right: { top_left: {x:95, y:50}, bottom_right: {x:100, y:50}, unit: '%' }
              }
            }
          },
          conditions: [ 'want_same_side' ]
        }
      },
      {
        type: 'nose',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:45}, bottom_right: {x:50, y:55}, unit: '%' }
            }
          },
          conditions: []
        }
      },
      {
        type: 'mouth',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:80}, bottom_right: {x:50, y:90}, unit: '%' }
            }
          },
          conditions: []
        }
      },
      {
        type: 'neck',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:90}, bottom_right: {x:50, y:100}, unit: '%' }
            }
          },
          conditions: []
        }
      }
    ],
    has: [ 'color', 'image' ],
    traits: { image: 'random' }
  },

  {// HAIR
    block: 'hair',
    wants: [
      {
        type: 'head',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:50}, bottom_right: {x:50, y:100}, unit: '%' }
            }
          },
          conditions: []
        }
      }
    ],
    has: [ 'color', 'image' ],
    traits: { image: 'random' }
  },

  {// EAR
    block: 'ear',
    wants: [
      {
        type: 'head',
        connector: {
          props: {
            side: {
              gen: 'connector.side',
              choose: 'opposite-parent-block-side'
            },
            pos: {
              gen: 'connector.pos',
              choose: 'connector-side',
              options: {
                left:  { top_left: {x:0,  y:50}, bottom_right: {x:0,   y:50}, unit: '%' },
                right: { top_left: {x:95, y:50}, bottom_right: {x:100, y:50}, unit: '%' },
              }
            }
          },
          conditions: []
        }
      }
    ],
    has: [ 'color', 'side', 'image' ],
    traits: { side: 'left_right', image: 'left_right' }
  },

  {// EYE
    block: 'eye',
    wants: [
      {
        type: 'head',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:50}, bottom_right: {x:50, y:50}, unit: '%' }
            }
          },
          conditions: []
        }
      }
    ],
    has: [ 'color', 'side', 'image' ],
    traits: { side: 'left_right_center', image: 'left_right_center' }
  },

  {// NOSE
    block: 'nose',
    wants: [
      {
        type: 'head',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:50}, bottom_right: {x:50, y:50}, unit: '%' }
            }
          },
          conditions: []
        }
      }
    ],
    has: [ 'color', 'image' ],
    traits: { image: 'random' }
  },

  {// MOUTH
    block: 'mouth',
    wants: [
      {
        type: 'head',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:50}, bottom_right: {x:50, y:50}, unit: '%' }
            }
          },
          conditions: []
        }
      }
    ],
    has: [ 'color', 'image' ],
    traits: { image: 'random' }
  },

  {// NECK
    block: 'neck',
    wants: [
      {
        type: 'head',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:0}, bottom_right: {x:50, y:1}, unit: '%' }
            }
          },
          conditions: []
        }
      },
      {
        type: 'torso',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:99}, bottom_right: {x:50,y:100}, unit: '%' }
            }
          },
          conditions: []
        }
      }
    ],
    has: [ 'color', 'image' ],
    traits: { image: 'random' }
  },

  {// TORSO
    block: 'torso',
    wants: [
      {
        type: 'neck',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:0}, bottom_right: {x:50,y:1}, unit: '%' }
            }
          },
          conditions: []
        }
      },
      {
        type: 'arm',
        count: 2,
        connector: {
          props: {
            side: {
              gen: 'connector.side',
              choose: 'next-free',
              options: [ 'left', 'right' ]
            },
            pos: {
              gen: 'connector.pos',
              choose: 'connector-side',
              options: {
                left:  { top_left: {x:0,  y:20}, bottom_right: {x:5,   y:30}, unit: '%' },
                right: { top_left: {x:95, y:20}, bottom_right: {x:100, y:30}, unit: '%' }
              }
            }
          },
          conditions: [ 'want_same_side' ]
        }
      },
      {
        type: 'hips',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:90}, bottom_right: {x:50,y:100}, unit: '%' }
            }
          },
          conditions: []
        }

      }
    ],
    has: [ 'color', 'image' ],
    traits: { image: 'random' }
  },

  {// ARM
    block: 'arm',
    wants: [
      {
        type: 'torso',
        connector: {
          props: {
            side: {
              gen: 'connector.side',
              choose: 'opposite-parent-block-side'
            },
            pos: {
              gen: 'connector.pos',
              choose: 'connector-side',
              options: {
                left:  { top_left: {x:0,  y:50}, bottom_right: {x:5,   y:50}, unit: '%' },
                right: { top_left: {x:95, y:50}, bottom_right: {x:100, y:50}, unit: '%' },
              }
            }
          },
          conditions: [ 'want_parent_side' ]
        }
      },
      {
        type: 'hand',
        connector: {
          props: {
            side: {
              gen: 'connector.side',
              choose: 'parent-block-side'
            },
            pos: {
              gen: 'connector.pos',
              choose: 'connector-side',
              options: {
                left:  { top_left: {x:0,  y:50}, bottom_right: {x:5,   y:50}, unit: '%' },
                right: { top_left: {x:95, y:50}, bottom_right: {x:100, y:50}, unit: '%' },
              }
            }
          },
          conditions: [ 'want_same_side' ]
        }
      }
    ],
    has: [ 'color', 'side', 'image' ],
    traits: { side: 'left_right', image: 'left_right' }
  },

  {// HAND
    block: 'hand',
    wants: [
      {
        type: 'arm',
        connector: {
          props: {
            side: {
              gen: 'connector.side',
              choose: 'opposite-parent-block-side'
            },
            pos: {
              gen: 'connector.pos',
              choose: 'connector-side',
              options: {
                left:  { top_left: {x:0,  y:50}, bottom_right: {x:5,   y:50}, unit: '%' },
                right: { top_left: {x:95, y:50}, bottom_right: {x:100, y:50}, unit: '%' },
              }
            }
          },
          conditions: [ 'want_parent_side' ]
        }
      }
    ],
    has: [ 'color', 'side', 'image' ],
    traits: { side: 'left_right', image: 'left_right' }
  },

  {// HIPS
    block: 'hips',
    wants: [
      {
        type: 'torso',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:0}, bottom_right: {x:50, y:5}, unit: '%' } //side = top
            }
          },
          conditions: []
        }
      },
      {
        type: 'leg',
        count: 2,
        connector: {
          props: {
            side: {
              gen: 'connector.side',
              choose: 'next-free',
              options: [ 'left', 'right' ]
            },
            pos: {
              gen: 'connector.pos',
              choose: 'connector-side',
              options: {
                left:  { top_left: {x:20,  y:95}, bottom_right: {x:25,  y:100}, unit: '%' },
                right: { top_left: {x:75, y:95}, bottom_right: {x:80, y:100}, unit: '%' }
              }
            }
          },
          conditions: [ 'want_same_side' ]
        }
      }
    ],
    has: [ 'color', 'image' ],
    traits: { image: 'random' }
  },

  {// LEG
    block: 'leg',
    wants: [
      {
        type: 'hips',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:0}, bottom_right: {x:50, y:5}, unit: '%' } //side = top
            }
          },
          conditions: []
        }
      },
      {
        type: 'foot',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:95}, bottom_right: {x:50, y:100}, unit: '%' } //side = bottom
            }
          },
          conditions: [ 'want_parent_side' ]
        }
      }
    ],
    has: [ 'color', 'side', 'image' ],
    traits: { side: 'left_right', image: 'left_right' }
  },

  {// FOOT
    block: 'foot',
    wants: [
      {
        type: 'leg',
        connector: {
          props: {
            pos: {
              gen: 'connector.pos',
              choose: { top_left: {x:50, y:0}, bottom_right: {x:50, y:10}, unit: '%' } //side = top
            }
          },
          conditions: [ 'want_parent_side' ]
        }
      }
    ],
    has: [ 'color', 'side', 'image' ],
    traits: { side: 'left_right', image: 'left_right' }
  }

];
