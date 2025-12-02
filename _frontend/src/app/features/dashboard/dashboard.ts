import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserInfoService, UsuarioInfo } from '../../core/user-info.service';
import { UserService, UsuarioDTO } from '../../core/user.service';
import { TransacaoService, TransacaoDTO, TipoTransacao } from '../../core/transacao.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  saldo = 0;
  lancamentos: Array<{ descricao?: string; valor: number; tipo: TipoTransacao; data?: string; dataObj?: Date }> = [];
  private allLancamentos: Array<{ descricao?: string; valor: number; tipo: TipoTransacao; data?: string; dataObj?: Date }> = [];
  
  usuario: UsuarioInfo | undefined;
  usuarioLoading = false;
  usuarioError = '';
  showUser = false;
  editMode = false;
  editUsuario: UsuarioInfo | undefined;
  
  showNewTransacaoModal = false;
  newTransacao: TransacaoDTO = { tipo: 'ENTRADA', valor: 0 };
  newTransacaoDataLocal: string = '';
  savingNewTransacao = false;
  
  filterTipo: 'TODOS' | TipoTransacao = 'TODOS';
  
  private routerSub?: Subscription;
  private refreshTimer?: any;

  constructor(
    private userInfo: UserInfoService,
    private userService: UserService,
    private auth: AuthService,
    private transacaoService: TransacaoService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.loadUser();
      this.loadSaldo();
      this.loadLancamentos();
      this.refreshTimer = setInterval(() => {
        this.loadSaldo();
        this.loadLancamentos();
      }, 30000);
    }
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url.startsWith('/dashboard')) {
        if (typeof window !== 'undefined') {
          this.loadUser();
          this.loadSaldo();
          this.loadLancamentos();
        }
      }
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  loadUser(): void {
    this.usuarioLoading = true;
    const svc: any = this.userInfo as any;
    const obs = (!svc || typeof svc.getMe !== 'function')
      ? this.userService.getMe()
      : svc.getMe();
    obs.subscribe({
      next: (user: UsuarioInfo) => {
        this.usuario = user;
        this.editUsuario = { ...user, senha: '' };
        this.usuarioLoading = false;
      },
      error: (err: any) => {
        if (err.status === 401 || err.status === 403) {
          this.logout();
        } else {
          this.usuario = undefined;
          this.usuarioLoading = false;
          this.usuarioError = 'Erro ao carregar dados do usuario.';
        }
      }
    });
  }

  private loadSaldo() {
    this.transacaoService.saldo().subscribe({
      next: (value) => this.saldo = Number(value || 0),
      error: (err) => console.error('Erro ao buscar saldo:', err)
    });
  }

  private loadLancamentos() {
    const tipoParam = this.filterTipo !== 'TODOS' ? this.filterTipo : undefined;
    const obs = tipoParam ? this.transacaoService.minhas(tipoParam) : this.transacaoService.ultimas(10);
    obs.subscribe({
      next: (list) => {
        this.allLancamentos = list.map(t => ({
          descricao: t.descricao,
          valor: t.valor,
          tipo: t.tipo,
          data: t.data,
          dataObj: this.parseBrDateTime(t.data)
        }));
        this.lancamentos = this.allLancamentos;
      },
      error: (err) => console.error('Erro ao listar transacoes:', err)
    });
  }

  private parseBrDateTime(dt?: string): Date | undefined {
    if (!dt) return undefined;
    try {
      const [date, time] = dt.split(' ');
      const [d, m, y] = date.split('/').map(Number);
      const [hh, mm, ss] = (time || '00:00:00').split(':').map(Number);
      return new Date(y, (m - 1), d, hh || 0, mm || 0, ss || 0);
    } catch {
      return undefined;
    }
  }

  onFiltroChange() {
    this.loadLancamentos();
  }

  onShowUser() {
    this.showUser = true;
    this.editMode = false;
    if (this.usuario) {
      this.editUsuario = { ...this.usuario, senha: '' };
    } else {
      this.loadUser();
    }
  }

  onCloseUser() {
    this.showUser = false;
  }

  onEditUser() {
    if (this.usuario) {
      this.editUsuario = { ...this.usuario, senha: '' };
      this.editMode = true;
    }
  }

  onSaveEdit() {
    if (!this.editUsuario) return;
    if (!this.editUsuario.senha) {
      alert('A senha e obrigatoria para atualizar.');
      return;
    }
    const dto: UsuarioDTO = {
      id: this.editUsuario.id,
      nome: this.editUsuario.nome,
      email: this.editUsuario.email,
      cpf: this.editUsuario.cpf,
      senha: this.editUsuario.senha,
      contasIds: [],
      centrosCustoIds: []
    };
    this.userService.update(dto.id!, dto).subscribe({
      next: () => {
        this.editMode = false;
        this.toast.success('Dados atualizados com sucesso.');
        this.loadUser();
      },
      error: () => this.toast.error('Erro ao atualizar dados.')
    });
  }

  onShowNewTransaction() {
    this.showNewTransacaoModal = true;
    this.newTransacao = { tipo: 'ENTRADA', valor: 0, descricao: '' };
    this.newTransacaoDataLocal = '';
  }

  onCancelNewTransaction() {
    this.showNewTransacaoModal = false;
  }

  private toBackendDateString(dtLocal?: string): string | undefined {
    if (!dtLocal) return undefined;
    try {
      const [date, time] = dtLocal.split('T');
      const [y, m, d] = date.split('-');
      const [hh, mm] = time.split(':');
      return `${d}/${m}/${y} ${hh}:${mm}:00`;
    } catch {
      return undefined;
    }
  }

  onSubmitNewTransaction() {
    if (!this.newTransacao || !this.newTransacao.tipo || !this.newTransacao.valor || this.newTransacao.valor <= 0) {
      this.toast.info('Informe tipo e valor maior que zero.');
      return;
    }
    const payload: TransacaoDTO = {
      ...this.newTransacao,
      data: this.toBackendDateString(this.newTransacaoDataLocal)
    };
    this.savingNewTransacao = true;
    this.showNewTransacaoModal = false;
    this.transacaoService.criar(payload).subscribe({
      next: () => {
        this.toast.success('Transacao criada com sucesso.');
        this.loadSaldo();
        this.loadLancamentos();
        this.savingNewTransacao = false;
      },
      error: () => {
        this.toast.error('Erro ao criar transacao.');
        this.savingNewTransacao = false;
      }
    });
  }

  logout() {
    this.auth.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}
