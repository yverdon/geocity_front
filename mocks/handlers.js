import { rest } from 'msw'
import { format } from 'date-fns'

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
                id: 1351,
                status: 2,
                shortname: '',
                administrative_entity: {
                  name: 'Mock event',
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
              comment: '',
              external_link: '',
            },
          },
        ],
      })
    )
  }),
]
