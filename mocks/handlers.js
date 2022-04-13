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
          wot_properties: {
            name: "Annuel (résident, taxi A, livraison de denrées périssables, marché, etc…) (Droits d'accès)",
            "Numéro d'immatriculation du véhicule entrant": 'VD 292150',
            'Motif précis de la demande': 'Clients taxi',
            'Adresse du bâtiment desservi':
              'Rue du Milieu 20, 1400 Yverdon-les-Bains',
            'Valable dès le': '2021-05-05',
            'Fréquence accès envisagée': 'Tous les jours et le samedi',
            'Carte grise du véhicule entrant':
              'permit_requests_uploads/279/100_70.jpg',
          },
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
          wot_properties: {
            name: 'Permis de fouille (Chantier sur la voie publique)',
            Description: 'changer rob eau',
            'Largeur [m]': 1.2,
            'Longueur [m]': 1.2,
            'Marquage routier endommagé': false,
            "Moins de 3m d'un tronc d'arbre ou haie": false,
            'Sur la chaussée': true,
            'Sur une surface verte': false,
            'Sur un trottoir': false,
          },
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
              ends_at: add(
                parseISO(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")),
                { hours: 4 }
              ),
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
                { days: 1, hours: 2 }
              ),
              comment: 'Mock comment',
              external_link: 'https://geocity.mapnv.ch/',
            },
          },
          {
            type: 'Feature',
            geometry: null,
            properties: {
              permit_request: {
                id: 329,
                status: 2,
                shortname: '',
                administrative_entity: {
                  name: 'Year - mock event',
                  ofs_id: 1,
                  link: 'https://mapnv.ch',
                  phone: '',
                },
                works_object_types: [],
                meta_types: [],
                intersected_geometries: '',
                works_object_types_names: {},
              },
              // starts_at: '2022-04-13T10:31:00+02:00',
              // ends_at: '2022-04-13T10:31:00+02:00',
              starts_at: null,
              ends_at: null,
              comment: '',
              external_link: '',
            },
          },
          {
            type: 'Feature',
            geometry: null,
            properties: {
              permit_request: {
                id: 329,
                status: 2,
                shortname: '',
                administrative_entity: {
                  name: 'Year - mock event',
                  ofs_id: 1,
                  link: 'https://mapnv.ch',
                  phone: '',
                },
                works_object_types: [],
                meta_types: [],
                intersected_geometries: '',
                works_object_types_names: {},
              },
              starts_at: '2021-07-13',
              ends_at: '2022-07-13',
              comment: '',
              external_link: '',
            },
          },
          {
            type: 'Feature',
            geometry: null,
            properties: {
              permit_request: {
                id: 329,
                status: 2,
                shortname: '',
                administrative_entity: {
                  name: 'Year - mock event',
                  ofs_id: 1,
                  link: 'https://mapnv.ch',
                  phone: '',
                },
                works_object_types: [],
                meta_types: [],
                intersected_geometries: '',
                works_object_types_names: {},
              },
              starts_at: '2021-07-27',
              ends_at: '2022-07-27',
              comment: '',
              external_link: '',
            },
          },
          {
            type: 'Feature',
            geometry: null,
            properties: {
              permit_request: {
                id: 329,
                status: 2,
                shortname: '',
                administrative_entity: {
                  name: 'Year - mock event',
                  ofs_id: 1,
                  link: 'https://mapnv.ch',
                  phone: '',
                },
                works_object_types: [],
                meta_types: [],
                intersected_geometries: '',
                works_object_types_names: {},
              },
              starts_at: '2021-08-05',
              ends_at: '2022-08-05',
              comment: '',
              external_link: '',
            },
          },
        ],
      })
    )
  }),
]
