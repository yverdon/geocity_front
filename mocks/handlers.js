import { rest } from 'msw'
import { add, parseISO, format } from 'date-fns'

export default [
  rest.get(`${process.env.GEOCITY_API}/current_user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        is_logged: true,
        username: 'Mock user',
        email: 'user.mock@liip.ch',
        login_datetime: '2022-04-06 08:29:04',
        expiration_datetime: '2022-04-06 09:29:04',
      })
    )
  }),

  rest.get(
    `${process.env.GEOCITY_API}/permits_details/100/`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          id: 100,
          wot_properties: [
            [
              {
                key: 'work_object_type',
                value: "Demande express (Droit d'accès (express))",
                type: 'text',
              },
              {
                key: 'Nom et prénom du chauffeur',
                value: 'XXX',
                type: 'text',
              },
              {
                key: "Numéro d'immatriculation du véhicule entrant",
                value: 'VD456565',
                type: 'text',
              },
              {
                key: 'Motif précis de la demande',
                value: 'Résident',
                type: 'text',
              },
            ],
            [
              {
                key: 'work_object_type',
                value: "Demande express (Droit d'accès (express))",
                type: 'text',
              },
              {
                key: 'Nom et prénom du chauffeur',
                value: 'XXX',
                type: 'text',
              },
              {
                key: "Numéro d'immatriculation du véhicule entrant",
                value: 'VD456565',
                type: 'text',
              },
              {
                key: 'Motif précis de la demande',
                value: 'Résident',
                type: 'text',
              },
            ],
          ],
        })
      )
    }
  ),

  rest.get(
    `${process.env.GEOCITY_API}/permits_details/200/`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          id: 200,
          wot_properties: [
            [
              {
                key: "work_object_type",
                value: "Avant-toits (Construction)",
                type: "text"
              },
              {
                key: "File",
                value: "/permit-requests/media/36/",
                type: "file"
              },
              {
                key: "Text",
                value: "Abcd",
                type: "text"
              },
              {
                key: "Regex",
                value: "1995",
                type: "regex"
              },
              {
                key: "Number",
                value: 35.0,
                type: "number"
              },
              {
                key: "List_single",
                value: "Choix B",
                type: "list_single"
              },
              {
                key: "List_multiple",
                value: [
                  "Choix A",
                  "Choix B",
                  "Choix C",
                  "Choix D",
                  "Choix E"
                ],
                type: "list_multiple"
              },
              {
                key: "Date",
                value: "2022-06-17",
                type: "date"
              },
              {
                key: "Checkbox",
                value: true,
                type: "checkbox"
              },
              {
                key: "Adresse",
                value: "Place Pestalozzi 2",
                type: "address"
              }
            ],
            [
              {
                key: "work_object_type",
                value: "Avant-toits (Démolition)",
                type: "text"
              },
              {
                key: "File",
                value: "/permit-requests/media/37/",
                type: "file"
              },
              {
                key: "Text",
                value: "efgh",
                type: "text"
              },
              {
                key: "Regex",
                value: "1997",
                type: "regex"
              },
              {
                key: "Number",
                value: 42.0,
                type: "number"
              },
              {
                key: "List_single",
                value: "Choix C",
                type: "list_single"
              },
              {
                key: "List_multiple",
                value: [
                  "Choix A",
                  "Choix C"
                ],
                type: "list_multiple"
              },
              {
                key: "Date",
                value: "2022-08-25",
                type: "date"
              },
              {
                key: "Checkbox",
                value: false,
                type: "checkbox"
              },
              {
                key: "Adresse",
                value: "Place Pestalozzi 2",
                type: "address"
              }
            ],
          ],
        })
      )
    }
  ),

  rest.get(`${process.env.GEOCITY_API}/events/`, (req, res, ctx) => {
    return res(
      ctx.json({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'GeometryCollection',
              geometries: [
                {
                  type: 'MultiPolygon',
                  coordinates: [
                    [
                      [
                        [2539113.32, 1181085.51],
                        [2539108.09, 1181072.42],
                        [2539124.84, 1181066.14],
                        [2539129.03, 1181079.49],
                        [2539113.32, 1181085.51],
                      ],
                    ],
                  ],
                },
              ],
            },
            bbox: [2539108.09, 1181066.14, 2539129.03, 1181085.51],
            properties: {
              permit_request: {
                id: 100,
                status: 2,
                shortname: 'Today - Mock shortname',
                administrative_entity: {
                  name: 'Mock name',
                  ofs_id: 1,
                  link: '',
                  phone: '0244236694',
                },
                works_object_types: [154],
                meta_types: [4],
                intersected_geometries:
                  '14530 - Zone archéologique -  1256 -  <br>21860 - Parcelle - Parcelle privée387 - 1920<br>21868 - Parcelle - Parcelle privée387 - 6466<br>',
                works_object_types_names: {
                  154: "Yvent - ébauches d'événements (Yvent - ébauches d'événements)",
                },
              },
              starts_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
              ends_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
              comment: 'Mock comment',
              external_link: 'https://geocity.mapnv.ch/',
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'GeometryCollection',
              geometries: [
                {
                  type: 'MultiPoint',
                  coordinates: [[2539145.27, 1181152.63]],
                },
                {
                  type: 'MultiPoint',
                  coordinates: [[2539163.41, 1181144.55]],
                },
                {
                  type: 'MultiPoint',
                  coordinates: [[2539108.58, 1181094.12]],
                },
              ],
            },
            bbox: [2539108.58, 1181094.12, 2539163.41, 1181152.63],
            properties: {
              permit_request: {
                id: 200,
                status: 2,
                shortname: 'Future - Mock event',
                administrative_entity: {
                  name: "Yverdon-les-Bains - Service de la Sécurité Publique - Événements dans l'espace public",
                  ofs_id: 1,
                  link: '',
                  phone: '0244236694',
                },
                works_object_types: [154],
                meta_types: [4],
                intersected_geometries:
                  '14530: Zone archéologique ;   ;\r\n                    1256 ;   <br>\r\n                    \r\n                    24326: Parcelle ; Parcelle privée ;\r\n                    387 ; 1881 <br>\r\n                    \r\n                    24154: Parcelle ; Parcelle privée ;\r\n                    387 ; 1882 <br>\r\n                    \r\n                    21860: Parcelle ; Parcelle privée ;\r\n                    387 ; 1920 <br>',
                works_object_types_names: {
                  154: "Yvent - ébauches d'événements (Yvent - ébauches d'événements)",
                },
              },
              starts_at: add(
                parseISO(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")),
                { days: 1 }
              ),
              ends_at: add(
                parseISO(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")),
                { days: 1 }
              ),
              comment: 'Mock comment',
              external_link: 'https://geocity.mapnv.ch/',
            },
          },
        ],
      })
    )
  }),
]
