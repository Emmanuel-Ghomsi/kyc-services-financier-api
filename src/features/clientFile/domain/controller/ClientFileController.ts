import { FastifyRequest, FastifyReply } from 'fastify';
import { ClientFileService } from '../service/ClientFileService';
import { ClientFileCreateRequest } from '@features/clientFile/presentation/request/ClientFileCreateRequest';
import { ClientFileIdentityRequest } from '@features/clientFile/presentation/request/ClientFileIdentityRequest';
import { ClientFileAddressRequest } from '@features/clientFile/presentation/request/ClientFileAddressRequest';
import { ClientFileActivityRequest } from '@features/clientFile/presentation/request/ClientFileActivityRequest';
import { ClientFileSituationRequest } from '@features/clientFile/presentation/request/ClientFileSituationRequest';
import { ClientFileInternationalRequest } from '@features/clientFile/presentation/request/ClientFileInternationalRequest';
import { ClientFileServicesRequest } from '@features/clientFile/presentation/request/ClientFileServicesRequest';
import { ClientFileOperationRequest } from '@features/clientFile/presentation/request/ClientFileOperationRequest';
import { ClientFilePepRequest } from '@features/clientFile/presentation/request/ClientFilePepRequest';
import { ClientFileComplianceRequest } from '@features/clientFile/presentation/request/ClientFileComplianceRequest';
import { exportClientFileToPDF } from '@infrastructure/export/PdfExporter';
import { exportClientFileToWord } from '@infrastructure/export/WordExporter';
import { ClientFileFundOriginRequest } from '@features/clientFile/presentation/request/ClientFileFundOriginRequest';
import { ClientFileListRequestSchema } from '@features/clientFile/presentation/request/ClientFileListRequest';

export class ClientFileController {
  static async create(
    req: FastifyRequest<{ Body: ClientFileCreateRequest }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    const created = await service.create(req.body, userId);
    res.code(201).send(created);
  }

  static async getOne(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    const roles = req.user?.roles || [];
    const file = await service.findById(req.params.id, userId, roles);
    res.send(file);
  } /**
   * Lister les fiches de l'utilisateur connecté (paginé)
   */
  static async getMyFiles(
    req: FastifyRequest,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const user = req.user;
    const query = ClientFileListRequestSchema.parse(req.query);
    const result = await service.getMyPaginatedFiles(user.id, query);
    return res.send(result);
  }

  /**
   * Lister toutes les fiches clients avec filtres (admin/super-admin)
   */
  static async getAll(
    req: FastifyRequest,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const query = ClientFileListRequestSchema.parse(req.query);
    const result = await service.getPaginatedAndFilteredFiles(query);
    return res.send(result);
  }

  static async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    const roles = req.user?.roles || [];
    await service.softDelete(req.params.id, userId, roles);
    res.send({ message: 'Fiche supprimée (soft delete)' });
  }

  static async validateAsAdmin(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const validatorId = req.user?.id;
    await service.validateAsAdmin(req.params.id, validatorId);
    res.send({ message: 'Fiche validée par l’administrateur' });
  }

  static async validateAsSuperAdmin(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const validatorId = req.user?.id;
    await service.validateAsSuperAdmin(req.params.id, validatorId);
    res.send({ message: 'Fiche validée par le super-admin' });
  }

  static async reject(
    req: FastifyRequest<{ Params: { id: string }; Body: { reason: string } }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const validatorId = req.user?.id;
    await service.reject(req.params.id, validatorId, req.body.reason);
    res.send({ message: 'Fiche rejetée' });
  }

  // --- ÉTAPES MULTI-STEP ---

  static async updateIdentity(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ClientFileIdentityRequest;
    }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    await service.updateIdentity(req.params.id, userId, req.body);
    res.send({ message: 'Identité mise à jour' });
  }

  static async updateAddress(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ClientFileAddressRequest;
    }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    await service.updateAddress(req.params.id, userId, req.body);
    res.send({ message: 'Coordonnées mises à jour' });
  }

  static async updateActivity(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ClientFileActivityRequest;
    }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    await service.updateActivity(req.params.id, userId, req.body);
    res.send({ message: 'Activité mise à jour' });
  }

  static async updateSituation(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ClientFileSituationRequest;
    }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    await service.updateSituation(req.params.id, userId, req.body);
    res.send({ message: 'Situation mise à jour' });
  }

  static async updateInternational(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ClientFileInternationalRequest;
    }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    await service.updateInternational(req.params.id, userId, req.body);
    res.send({ message: 'Transactions internationales mises à jour' });
  }

  static async updateServices(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ClientFileServicesRequest;
    }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    await service.updateServices(req.params.id, userId, req.body);
    res.send({ message: 'Services mis à jour' });
  }

  static async updateOperation(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ClientFileOperationRequest;
    }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    await service.updateOperation(req.params.id, userId, req.body);
    res.send({ message: 'Fonctionnement du compte mis à jour' });
  }

  static async updatePEP(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ClientFilePepRequest;
    }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    await service.updatePEP(req.params.id, userId, req.body);
    res.send({ message: 'Informations PEP mises à jour' });
  }

  static async updateCompliance(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ClientFileComplianceRequest;
    }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    await service.updateCompliance(req.params.id, userId, req.body);
    res.send({ message: 'Classification LBC/FT mise à jour' });
  }

  static async exportPDF(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    const roles = req.user?.roles || [];
    const file = await service.findById(req.params.id, userId, roles);
    const buffer = await exportClientFileToPDF(file);

    res.header('Content-Type', 'application/pdf');
    res.header(
      'Content-Disposition',
      `attachment; filename=${file.reference}.pdf`
    );
    res.send(buffer);
  }

  static async exportWord(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    const roles = req.user?.roles || [];
    const file = await service.findById(req.params.id, userId, roles);
    const buffer = await exportClientFileToWord(file);

    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.header(
      'Content-Disposition',
      `attachment; filename=${file.reference}.docx`
    );
    res.send(buffer);
  }

  static async updateFundOrigin(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ClientFileFundOriginRequest;
    }>,
    res: FastifyReply,
    service: ClientFileService
  ) {
    const userId = req.user?.id;
    await service.updateFundOrigin(req.params.id, userId, req.body);
    res.send({ message: 'Origine des fonds mise à jour' });
  }
}
