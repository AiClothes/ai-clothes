import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { AxiosRequestConfig } from 'axios';
import { CreateCommonDto } from './dto/create-common.dto';
import { UpdateCommonDto } from './dto/update-common.dto';
import { OperateObjectType, OperateType } from '@one-server/core';
import { QueryCommonDto } from './dto/query-common.dto';
import { LogService } from '../log/log.service';
import { PrismaService } from '../prisma/prisma.service';
import * as STS from 'qcloud-cos-sts';
import { UploadFileDto } from './dto/upload-file.dto';
import { GeneralSegmentDto } from './dto/general-segment.dto';
import { HttpService } from '@nestjs/axios';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { HSSign, SignParams } from './utils/hs_sign';
import * as qs from 'querystring';
import * as TencentCloudAiArt from 'tencentcloud-sdk-nodejs-aiart';
import { TextToImageRequest } from 'tencentcloud-sdk-nodejs-aiart/src/services/aiart/v20221229/aiart_models';
import {
  AIDrawDto,
  MajorStyle,
  styleDetails,
  StyleItem
} from './dto/ai-draw.dto';

// 插件使用
dayjs.extend(utc);

@Injectable()
export class CommonService {
  // 腾讯云 上传配置
  private readonly upload_config = {
    secretId: process.env.SECRET_ID, // 固定密钥
    secretKey: process.env.SECRET_KEY, // 固定密钥
    proxy: '',
    durationSeconds: 1800,
    // host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
    endpoint: 'sts.tencentcloudapi.com', // 域名，非必须，与host二选一，默认为 sts.tencentcloudapi.com

    // 放行判断相关参数
    bucket: 'base-1327679787',
    region: 'ap-guangzhou',
    // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
    allowPrefix: 'sp/*',
    // 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
    allowActions: [
      // 简单上传
      'name/cos:PutObject',
      'name/cos:PostObject',
      // 分片上传
      'name/cos:InitiateMultipartUpload',
      'name/cos:ListMultipartUploads',
      'name/cos:ListParts',
      'name/cos:UploadPart',
      'name/cos:CompleteMultipartUpload'
    ]
  };
  private readonly endpoint = 'https://visual.volcengineapi.com';
  private readonly HSAccessKeyId = process.env.HS_ACCESS_KEY_ID;
  private readonly HSSecretAccessKey = process.env.HS_SECRET_ACCESS_KEY;

  constructor(
    private prisma: PrismaService,
    private log: LogService,
    private httpService: HttpService
  ) {}

  async create(data: CreateCommonDto) {
    const r = await this.prisma.miniProgramConfig.create({
      data: {
        ...data
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.CREATE,
      operate_object_type: OperateObjectType.PRODUCT_CATEGORY,
      operate_object_id: r.id,
      operate_content: '',
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // findAll全部用来使用分页查询方案
  findAll(query: QueryCommonDto) {
    const { current = 1, page_size = 20 } = query;
    // 初期分类不需要设置分页
    // const skip = (current - 1) * page_size;
    // const take = page_size;
    return this.prisma.miniProgramConfig.findMany({
      where: {
        deleted_at: null
      },
      orderBy: {
        created_at: 'desc'
      }
      // skip: skip,
      // take: take
    });
  }

  // 数量查询
  count(query: QueryCommonDto) {
    const {} = query;
    return this.prisma.miniProgramConfig.count({
      where: {
        deleted_at: null
      }
    });
  }

  findTree(query: object) {
    return this.prisma.miniProgramConfig.findMany({
      where: {
        deleted_at: null
      }
    });
  }

  // 查询具体日志信息
  findOne(id: number) {
    return this.prisma.miniProgramConfig.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(data: UpdateCommonDto) {
    const old = await this.findOne(data.id);
    const r = await this.prisma.miniProgramConfig.update({
      where: {
        id: data.id
      },
      data: data
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.UPDATE,
      operate_object_type: OperateObjectType.PRODUCT_CATEGORY,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 设置deleted_at时间为真
  async remove(id: number) {
    const old = await this.findOne(id);
    const r = await this.prisma.miniProgramConfig.update({
      where: {
        id: id
      },
      data: {
        deleted_at: new Date()
      }
    });
    this.log.system_operate({
      success: true,
      operate_type: OperateType.DELETE,
      operate_object_type: OperateObjectType.PRODUCT_CATEGORY,
      operate_object_id: r.id,
      operate_content: JSON.stringify(old),
      operate_result: JSON.stringify(r)
    });
    return r;
  }

  // 处理上传图片的token
  async upload(data: UploadFileDto) {
    const { allowPrefix } = data || {};
    // 获取临时密钥
    const shortBucketName = this.upload_config.bucket.substr(
      0,
      this.upload_config.bucket.lastIndexOf('-')
    );
    const appId = this.upload_config.bucket.substr(
      1 + this.upload_config.bucket.lastIndexOf('-')
    );
    const resource = [
      `qcs::cos:${this.upload_config.region}:uid/${appId}:prefix//${appId}/${shortBucketName}/${allowPrefix || this.upload_config.allowPrefix}`
    ];
    const policy = {
      version: '2.0',
      statement: [
        {
          action: this.upload_config.allowActions,
          effect: 'allow',
          principal: { qcs: ['*'] },
          resource: resource
          // condition生效条件，关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
          // 'condition': {
          //   // 比如限定ip访问
          //   'ip_equal': {
          //     'qcs:ip': '10.121.2.10/24'
          //   }
          // }
        }
      ]
    };
    return new Promise((resolve, reject) => {
      STS.getCredential(
        {
          secretId: this.upload_config.secretId,
          secretKey: this.upload_config.secretKey,
          proxy: this.upload_config.proxy,
          durationSeconds: this.upload_config.durationSeconds,
          endpoint: this.upload_config.endpoint,
          policy: policy
        },
        function callback(err, tempKeys) {
          const result = JSON.stringify(err) || '';
          if (err) {
            reject(result);
            return;
          }
          resolve(tempKeys);
        }
      );
    });
  }

  // 图像切割
  async aiCut(data: GeneralSegmentDto) {
    const { image_url } = data;

    console.log('image_url', image_url);

    const action = 'GeneralSegment';
    const version = '2020-08-26';
    // const action = 'ListUsers';
    // const version = '2018-01-01';
    // const limit = '10';
    // const offset = '0';
    const region = 'cn-north-1';
    const service = 'cv';
    // const region = 'cn-beijing';
    // const service = 'iam';

    const body = {
      image_url: image_url,
      return_foreground_image: 1
    };

    console.log('body', qs.stringify(body));

    const ha_sign = new HSSign();

    const signParams: SignParams = {
      headers: {
        ['Content-Type']: 'application/x-www-form-urlencoded',
        ['Host']: `${new URL(this.endpoint).host}`,
        ['X-Date']: ha_sign.getDateTimeNow()
        // 官方测试用
        // [`Host`]: `iam.volcengineapi.com`,
        // [`X-Date`]: `20240619T071306Z`
      },
      method: 'POST',
      // method: 'GET',
      query: {
        Action: action,
        Version: version
        // Limit: limit,
        // Offset: offset
      },
      accessKeyId: this.HSAccessKeyId,
      secretAccessKey: this.HSSecretAccessKey,
      // accessKeyId: 'AKLTYWViMTVmZGYzM2E0NDI5Mzk2MDZjNjFmMjc2MjRjMzg',
      // secretAccessKey:
      //   'WkRZeE1EQmxPVGhsWWpWak5HVmtNbUUxTXpZeU9UVXlOMlE1TmpZeVlqTQ==',
      serviceName: service,
      region: region,
      bodySha: ha_sign.getBodySha(qs.stringify(body))
    };

    for (const [key, val] of Object.entries(signParams.query)) {
      if (val === undefined || val === null) {
        signParams.query[key] = '';
      }
    }

    const authorization = ha_sign.sign(signParams);

    console.log('authorization', authorization);

    const url = `${this.endpoint}/?${qs.stringify(signParams.query)}`;
    // const url = `https://iam.volcengineapi.com/?Action=ListUsers&Version=2018-01-01&Limit=10&Offset=0`;

    console.log('url', url);

    const config: AxiosRequestConfig = {
      headers: {
        ...signParams.headers,
        Authorization: authorization
      },
      method: signParams.method, // 等具体的HTTP方法
      data: qs.stringify(body),
      responseType: 'json'
    };

    console.log('config', config);

    const response = await this.httpService.axiosRef
      .request({ url, ...config })
      .then((res) => res)
      .catch((err) => {
        console.error(err.response.data);
        throw err;
      });

    return response.data;
  }

  // AI绘图
  async aiDraw(r: AIDrawDto) {
    const { text, ng_text, major_style, style, resolution_ratio } = r;

    // 定义一个函数返回风格
    function getStyleItem(
      major?: MajorStyle,
      detail?: string
    ): StyleItem | undefined {
      const details = styleDetails[major];
      if (details && details[detail] !== undefined) {
        return {
          major,
          detail,
          code: details[detail]
        };
      }
      return undefined;
    }

    const AiArtClient = TencentCloudAiArt.aiart.v20221229.Client;

    // 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
    // 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
    // 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
    const clientConfig = {
      credential: {
        secretId: process.env.SECRET_ID,
        secretKey: process.env.SECRET_KEY
      },
      region: 'ap-guangzhou',
      profile: {
        httpProfile: {
          endpoint: 'aiart.tencentcloudapi.com'
        }
      }
    };

    // 实例化要请求产品的client对象,clientProfile是可选的

    let myStyle = null;
    if (major_style && style) {
      myStyle = getStyleItem(major_style, style);

      if (!myStyle) {
        throw new Error('未知风格！');
      }
    }

    const client = new AiArtClient(clientConfig);
    const params: TextToImageRequest = {
      Prompt: text,
      ...(ng_text ? { NegativePrompt: ng_text } : {}),
      ...(myStyle ? { Styles: [myStyle.code] } : {}),
      // 不标记ai logo
      LogoAdd: 0,
      ResultConfig: {
        // 768:768（1:1）、768:1024（3:4）、1024:768（4:3）、1024:1024（1:1）、720:1280（9:16）、1280:720（16:9）、768:1280（3:5）、1280:768（5:3）、1080:1920（9:16）、1920:1080（16:9）
        Resolution: resolution_ratio || '1024:1024'
      }
    };
    const data = await client.TextToImage(params);
    // console.log(data);
    const { RequestId, ResultImage } = data;
    // 需要在前端把base64数据，转化为实际的图片地址
    return ResultImage;
  }
}
