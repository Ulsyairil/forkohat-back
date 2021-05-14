'use strict';

const axios = require('axios');
const { validate } = use('Validator');

class IndonesianAreaController {
  async getProvince({ request, response }) {
    try {
      let url = 'https://dev.farizdotid.com/api/daerahindonesia/provinsi';
      let province = await axios.get(url);

      console.log(province);

      return response.send(province.data.provinsi);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async detailProvince({ request, response }) {
    try {
      const rules = {
        province_id: 'required|number',
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let url = `https://dev.farizdotid.com/api/daerahindonesia/provinsi/${request.input(
        'province_id'
      )}`;
      let province = await axios.get(url);

      console.log(province);

      return response.send(province.data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async getCity({ request, response }) {
    try {
      const rules = {
        province_id: 'required|number',
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let url = `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${request.input(
        'province_id'
      )}`;
      let city = await axios.get(url);

      console.log(city);

      return response.send(city.data.kota_kabupaten);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async detailCity({ request, response }) {
    try {
      const rules = {
        city_id: 'required|number',
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let url = `https://dev.farizdotid.com/api/daerahindonesia/kota/${request.input(
        'city_id'
      )}`;
      let city = await axios.get(url);

      console.log(city);

      return response.send(city.data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async getDistrict({ request, response }) {
    try {
      const rules = {
        city_id: 'required|number',
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let url = `https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${request.input(
        'city_id'
      )}`;
      let district = await axios.get(url);

      console.log(district);

      return response.send(district.data.kecamatan);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async detailDistrict({ request, response }) {
    try {
      const rules = {
        district_id: 'required|number',
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let url = `https://dev.farizdotid.com/api/daerahindonesia/kecamatan/${request.input(
        'district_id'
      )}`;
      let district = await axios.get(url);

      console.log(district);

      return response.send(district.data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async getSubDistrict({ request, response }) {
    try {
      const rules = {
        district_id: 'required|number',
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let url = `https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=${request.input(
        'district_id'
      )}`;
      let sub_district = await axios.get(url);

      console.log(sub_district);

      return response.send(sub_district.data.kelurahan);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  async detailSubDistrict({ request, response }) {
    try {
      const rules = {
        sub_district_id: 'required|number',
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages());
      }

      let url = `https://dev.farizdotid.com/api/daerahindonesia/kelurahan/${request.input(
        'sub_district_id'
      )}`;
      let sub_district = await axios.get(url);

      console.log(sub_district);

      return response.send(sub_district.data);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = IndonesianAreaController;
